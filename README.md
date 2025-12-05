JET LAG: THE HOME GAME COMPANION

Jet Lag: The Game is a travel/game-show YouTube channel produced and funded by
Wendover Productions and Nebula. Each season focuses around a different playground
or board game that's played across region, often incorporating public transit.

Following the release of their second Hide & Seek season, "Hide + Seek: Japan",
they released a home game for people to play anywhere.

This project is a companion to the home game, creating a digital space for game
elements such as challenge cards, hiding time, hider/seeker communication and rules.

It is run through an node express server, with card interactions being sent by a 
custom messaging system.

--------------------------------------------------------------------------------

This project set some limits to avoid scope creep:

1. For the purposes of this class (CS 290), the focus would be on the Hider interface,
which contains a digital hand for cards, as well as an automated way to send cards through
the built-in messaging system.
2. The project would assume only one game was occuring at a time (i.e. there is
no support for concurrent games or seperate lobbies)

Potential expansions to this project could be the creation of the Seeker interface,
which would include an interface for sending questions through the messaging system.
Another expansion could be support for concurrent games.

--------------------------------------------------------------------------------

This project was created for the CS 290 001 F2025 class, taught by Robin Hess at
Oregon State University. This project has no affiliations with Jet Lag: The Game,
Wendover Productions, or Nebula.

Team Members:
Brennan Duman - Recieving/displaying messages & EJS templatization\
Joe Haney - Sending/storing messages & hider time tracking (& leaderboard?)\
Aidan Rubey - Drawing & playing cards\
Nathan Anderson - All frontend design\