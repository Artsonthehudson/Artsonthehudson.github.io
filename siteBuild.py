from flask import Flask, request, render_template, g, Markup
import sqlite3
import datetime
import markdown
from flask_frozen import Freezer
import os
import shutil

app = Flask(__name__)
freezer = Freezer(app)

#Date
today = datetime.datetime.today()

#variables
logo = 'pyrrhic_logo.jpg'

app.database = "AOTH_DB"
def connectdb():
    # type: () -> object
    return sqlite3.connect(app.database)

def movehome():
    files = os.listdir('build')
    for file in files:
        shutil.move('build/' + file, file)

def get_markdown(md):
    path = 'markdown/'+md
    f = open(path, 'r')
    content = markdown.markdown(f.read())
    output = Markup(markdown.markdown(content))
    return output
    
conn = connectdb()

@app.route("/")
def homepage():
    title = 'Arts Nonprofit | Jersey City | Arts on the Hudson'
    return render_template('index.html', **locals())

@app.route("/staff")
def about():
    plogo = logo
    title = 'Staff | Jersey City | Arts on the Hudson'
    staff = conn.execute("SELECT * from about_staff")
    return render_template('staff.html', **locals())

@app.route("/contact")
def contact():
    title =  'Contact | Jersey City | Arts on the Hudson'
    return render_template('contact.html',**locals())

@app.route("/<event>")
def events(event):
    title =  'Events | Jersey City | Arts on the Hudson'
    upcomingevents = conn.execute("SELECT * from events where date >= date('now') order by date").fetchall()
    len_upcoming = len(upcomingevents)
    pastevents = conn.execute("SELECT * from events where date < date('now') order by date").fetchall()
    len_past = len(pastevents)
    cssclass = 'aevents'
    return render_template('events.html',**locals())
    
@freezer.register_generator
def events():
    events = ['events','pastevents']
    for event in events:
        yield {'event':event}

@app.route("/give")
def give():
    title = 'Give | Jersey City | Arts on the Hudson'
    return render_template('blanktemplate.html',**locals())

@app.route("/education")
def education():   
    title = 'Education | Jersey City | Arts on the Hudson' 
    cssclass = 'aeducation'
    programs = conn.execute("SELECT * FROM education") 
    return render_template('education.html', **locals())

@app.route("/education-<program>")
def program(program):   
    cssclass = 'aeducation'
    programs = conn.execute("SELECT * FROM education where url = '{}'".format(program)).fetchall()[0]
    title = programs[1]  +' | Jersey City | Arts on the Hudson' 
    return render_template('program.html', **locals())

@freezer.register_generator
def program():
    education = conn.execute("SELECT * from education").fetchall()
    for i in education:
        program = i[6]
        yield {'program':program}

@app.route("/events-<event>")
def eventpage(event):   
    cssclass = 'aeducation'
    events = conn.execute("SELECT * FROM events where url = '{}'".format(event)).fetchall()[0]
    title = events[1]  +' | Jersey City | Arts on the Hudson' 
    return render_template('eventpage.html', **locals())

@freezer.register_generator
def eventpage():
    events = conn.execute("SELECT * from events").fetchall()
    for i in events:
        event = i[6]
        yield {'event':event}

if __name__ == "__main__":
    """ Builds this site.
        """
    print("Building website...")
    app.debug = False
    app.testing = True
    freezer.freeze()
    movehome()
