BigBoard ticket system browser
==============================

How to use it
-------------

Clone the repository in the usual way:

	$ git clone git://github.com/achingbrain/bigboard.git

Import it into your favourite IDE and execute the main method in:

	net.achingbrain.bigboard.launcher.Launcher

Alternatively use the maven exec plugin from the repository root:

	mvn exec:java

Open http://localhost:8060 in your favourite web browser (ie. FireFox.  It is FireFox, right?  Ok, Chrome is alright.  Better not be IE.  Well, it could be IE, but I wouldn't, get what I'm saying?).

Server settings
---------------

Server settings are not persisted across browsers (although they are across multiple sessions on a single browser).  Use the import/export JSON options to make things easier.