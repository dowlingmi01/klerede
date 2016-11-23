var React = require('react');
var $ = require('jquery');
var getDOMNode = require('../kutils/getDOMNode');

//icons
var Caret = require('../svg-icons').Caret;
var Circle = require('../svg-icons').Circle;
var CloseIcon = require('../svg-icons').CloseIcon;
var EditIcon = require('../svg-icons').EditIcon;
var NoteIcon = require('../svg-icons').NoteIcon;
var SlimMinusSign = require('../svg-icons').SlimMinusSign;

//lib components
var BigCalendar = require('../../libs/react-big-calendar');
var Select = require('react-select');
var moment = require('moment');

//local components
var AddNoteTip = require('./add-note-tip');
var SVGButton = require('./svg-button');
var wnt = require('../kcomponents/wnt');
var du = require('../kutils/date-utils');
var KAPI = {
    notes:require('../kapi/notes'),
    auth:require('../kapi/auth')
};

BigCalendar.momentLocalizer(moment);

var eventsTest = [{
    "id": 19,
    "header": "Test again for 3rd",
    "description": "should add note to the 3rd test",
    "all_day": 0,
    "time_start": "2016-10-02 00:00:00",
    "time_end": "2016-10-02 00:00:00",
    "owner_id": 5,
    "last_editor_id": 5,
    "venue_id": 1518,
    "created_at": "2016-11-03 19:03:15",
    "updated_at": "2016-11-03 19:03:15",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 1,
        "description": "Facility",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 19,
            "tag_id": 1
        }
    }
    ]
}, {
    "id": 16,
    "header": "Test Note",
    "description": "things happened tody",
    "all_day": 0,
    "time_start": "2016-10-04 00:00:00",
    "time_end": "2016-10-04 00:00:00",
    "owner_id": 5,
    "last_editor_id": 5,
    "venue_id": 1518,
    "created_at": "2016-11-03 18:59:26",
    "updated_at": "2016-11-03 18:59:26",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 7,
        "description": "Campaign",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 16,
            "tag_id": 7
        }
    }
    ]
}, {
    "id": 17,
    "header": "Note Test for 10\/4",
    "description": "does this actually add",
    "all_day": 0,
    "time_start": "2016-10-04 10:00:00",
    "time_end": "2016-10-04 12:00:00",
    "owner_id": 5,
    "last_editor_id": 5,
    "venue_id": 1518,
    "created_at": "2016-11-03 19:00:52",
    "updated_at": "2016-11-03 19:00:52",
    "channels": [{
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }
    ],
    "tags": [{
        "id": 1,
        "description": "Facility",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 17,
            "tag_id": 1
        }
    }
    ]
}, {
    "id": 30,
    "header": "3rd note",
    "description": "The word\/ character limit happens in many occasions. For example: Twitter: 140, SMS: 160, Reddit Title: 300, Ebay Title: 80, Yelp Post: 5000, LinkedIn Summary:",
    "all_day": 1,
    "time_start": "2016-10-06 00:00:00",
    "time_end": "2016-10-06 00:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-07 23:37:22",
    "updated_at": "2016-11-07 23:37:22",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 3,
        "description": "Group visit",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 30,
            "tag_id": 3
        }
    }, {
        "id": 6,
        "description": "Local event",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 30,
            "tag_id": 6
        }
    }
    ]
}, {
    "id": 31,
    "header": "note 4",
    "description": "The word\/ character limit happens in many occasions. For example: Twitter: 140, SMS: 160, Reddit Title: 300, Ebay Title: 80, Yelp Post: 5000, LinkedIn Summary:",
    "all_day": 1,
    "time_start": "2016-10-06 00:00:00",
    "time_end": "2016-10-06 00:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-07 23:43:30",
    "updated_at": "2016-11-07 23:43:30",
    "channels": [{
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }
    ],
    "tags": [{
        "id": 1,
        "description": "Facility",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 31,
            "tag_id": 1
        }
    }
    ]
}, {
    "id": 32,
    "header": "Note 5",
    "description": "The word\/ character limit happens in many occasions. For example: Twitter: 140, SMS: 160, Reddit Title: 300, Ebay Title: 80, Yelp Post: 5000, LinkedIn Summary: ...",
    "all_day": 1,
    "time_start": "2016-10-06 00:00:00",
    "time_end": "2016-10-06 00:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-07 23:43:45",
    "updated_at": "2016-11-07 23:43:45",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 4,
        "description": "Special exhibit",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 32,
            "tag_id": 4
        }
    }
    ]
}, {
    "id": 20,
    "header": "This is week view Oct 6th",
    "description": "This is week view Oct 6th",
    "all_day": 0,
    "time_start": "2016-10-06 11:00:00",
    "time_end": "2016-10-06 14:00:00",
    "owner_id": 5,
    "last_editor_id": 5,
    "venue_id": 1518,
    "created_at": "2016-11-03 20:14:01",
    "updated_at": "2016-11-03 20:14:01",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 6,
        "description": "Local event",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 20,
            "tag_id": 6
        }
    }
    ]
}, {
    "id": 18,
    "header": "Test Again for the 7th",
    "description": "Note is supposed to add on the 7th but seems to be adding to the 20th",
    "all_day": 0,
    "time_start": "2016-10-07 10:30:00",
    "time_end": "2016-10-07 11:30:00",
    "owner_id": 5,
    "last_editor_id": 5,
    "venue_id": 1518,
    "created_at": "2016-11-03 19:02:19",
    "updated_at": "2016-11-03 19:02:19",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 6,
        "description": "Local event",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 18,
            "tag_id": 6
        }
    }
    ]
}, {
    "id": 25,
    "header": "Note for the 9th - I'M changing this note now - 2nd change - this one on Chrome",
    "description": "testing",
    "all_day": 1,
    "time_start": "2016-10-09 00:00:00",
    "time_end": "2016-10-09 00:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-07 16:57:49",
    "updated_at": "2016-11-07 17:01:21",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 6,
        "description": "Local event",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 25,
            "tag_id": 6
        }
    }
    ]
}, {
    "id": 47,
    "header": "Test note",
    "description": "MD made on a PC using FF",
    "all_day": 1,
    "time_start": "2016-10-12 00:00:00",
    "time_end": "2016-10-12 00:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-10 22:12:57",
    "updated_at": "2016-11-10 22:12:57",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 3,
        "description": "Group visit",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 47,
            "tag_id": 3
        }
    }, {
        "id": 14,
        "description": "MDTest",
        "venue_id": 1518,
        "owner_id": 1,
        "pivot": {
            "note_id": 47,
            "tag_id": 14
        }
    }
    ]
}, {
    "id": 48,
    "header": "Test note",
    "description": "MD test of IE on Windows",
    "all_day": 1,
    "time_start": "2016-10-12 00:00:00",
    "time_end": "2016-10-12 00:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-11 20:11:34",
    "updated_at": "2016-11-11 20:11:34",
    "channels": [{
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 8,
        "description": "State holiday",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 48,
            "tag_id": 8
        }
    }
    ]
}, {
    "id": 29,
    "header": "2nd note example",
    "description": "0123456 78901 234567 90123 4567890 1234567 8901234567890 1234567890 1234567890123 45678901234567890123456789 ",
    "all_day": 1,
    "time_start": "2016-10-13 00:00:00",
    "time_end": "2016-10-13 00:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-07 23:32:31",
    "updated_at": "2016-11-07 23:33:01",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 7,
        "description": "Campaign",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 29,
            "tag_id": 7
        }
    }
    ]
}, {
    "id": 46,
    "header": "terwer",
    "description": "werwerwer",
    "all_day": 1,
    "time_start": "2016-10-13 00:00:00",
    "time_end": "2016-10-13 00:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-10 18:39:48",
    "updated_at": "2016-11-10 18:39:48",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 1,
        "description": "Facility",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 46,
            "tag_id": 1
        }
    }, {
        "id": 13,
        "description": "Test Category @",
        "venue_id": 1518,
        "owner_id": 1,
        "pivot": {
            "note_id": 46,
            "tag_id": 13
        }
    }
    ]
}, {
    "id": 27,
    "header": "LONG NOTE EXAMPLE",
    "description": "\"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\"",
    "all_day": 0,
    "time_start": "2016-10-13 10:00:00",
    "time_end": "2016-10-13 12:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-07 23:12:35",
    "updated_at": "2016-11-08 20:58:51",
    "channels": [{
        "id": 1,
        "code": "gate"
    }
    ],
    "tags": [{
        "id": 7,
        "description": "Campaign",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 27,
            "tag_id": 7
        }
    }
    ]
}, {
    "id": 37,
    "header": "Test Note",
    "description": "Pateways, conference servers and other custom solutions.Pateways, conference servers and other custom solutions. fsdefgt",
    "all_day": 1,
    "time_start": "2016-10-14 00:00:00",
    "time_end": "2016-10-14 00:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-08 23:19:36",
    "updated_at": "2016-11-08 23:19:36",
    "channels": [{
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }
    ],
    "tags": [{
        "id": 3,
        "description": "Group visit",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 37,
            "tag_id": 3
        }
    }
    ]
}, {
    "id": 40,
    "header": "4th note",
    "description": " ellipses  ellipses  ellipses  ellipses ",
    "all_day": 1,
    "time_start": "2016-10-14 00:00:00",
    "time_end": "2016-10-14 00:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-08 23:23:06",
    "updated_at": "2016-11-08 23:23:06",
    "channels": [{
        "id": 1,
        "code": "gate"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 3,
        "description": "Group visit",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 40,
            "tag_id": 3
        }
    }
    ]
}, {
    "id": 41,
    "header": "5th note",
    "description": " ellipses  ellipses  ellipses ",
    "all_day": 1,
    "time_start": "2016-10-14 00:00:00",
    "time_end": "2016-10-14 00:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-08 23:23:19",
    "updated_at": "2016-11-08 23:23:19",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 9,
        "description": "School holiday",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 41,
            "tag_id": 9
        }
    }
    ]
}, {
    "id": 42,
    "header": "6th note",
    "description": " ellipses  ellipses  ellipses ",
    "all_day": 0,
    "time_start": "2016-10-14 09:00:00",
    "time_end": "2016-10-14 10:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-08 23:24:04",
    "updated_at": "2016-11-08 23:24:04",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 4,
        "description": "Special exhibit",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 42,
            "tag_id": 4
        }
    }
    ]
}, {
    "id": 38,
    "header": "2nd Note",
    "description": " ellipses  ellipses  ellipses  ellipses  ellipses  ellipses ",
    "all_day": 0,
    "time_start": "2016-10-14 10:00:00",
    "time_end": "2016-10-14 12:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-08 23:22:20",
    "updated_at": "2016-11-08 23:22:20",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 3,
        "description": "Group visit",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 38,
            "tag_id": 3
        }
    }
    ]
}, {
    "id": 39,
    "header": "3rd Note",
    "description": " ellipses  ellipses  ellipses  ellipses  ellipses ",
    "all_day": 0,
    "time_start": "2016-10-14 11:00:00",
    "time_end": "2016-10-14 13:30:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-08 23:22:46",
    "updated_at": "2016-11-08 23:22:46",
    "channels": [{
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }
    ],
    "tags": [{
        "id": 4,
        "description": "Special exhibit",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 39,
            "tag_id": 4
        }
    }
    ]
}, {
    "id": 45,
    "header": "Test Note",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliq",
    "all_day": 0,
    "time_start": "2016-10-15 09:00:00",
    "time_end": "2016-10-15 10:00:00",
    "owner_id": 1,
    "last_editor_id": 1,
    "venue_id": 1518,
    "created_at": "2016-11-10 18:06:43",
    "updated_at": "2016-11-10 18:06:43",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }
    ],
    "tags": [{
        "id": 3,
        "description": "Group visit",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 45,
            "tag_id": 3
        }
    }
    ]
}, {
    "id": 21,
    "header": "Hey!",
    "description": "Testting",
    "all_day": 0,
    "time_start": "2016-10-17 00:00:00",
    "time_end": "2016-10-17 00:00:00",
    "owner_id": 3,
    "last_editor_id": 3,
    "venue_id": 1518,
    "created_at": "2016-11-04 13:50:50",
    "updated_at": "2016-11-04 13:50:50",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 8,
        "description": "State holiday",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 21,
            "tag_id": 8
        }
    }
    ]
}, {
    "id": 6,
    "header": "happened today",
    "description": "things happened",
    "all_day": 0,
    "time_start": "2016-10-20 09:00:00",
    "time_end": "2016-10-20 11:00:00",
    "owner_id": 5,
    "last_editor_id": 5,
    "venue_id": 1518,
    "created_at": "2016-10-31 21:28:10",
    "updated_at": "2016-10-31 21:28:10",
    "channels": [{
        "id": 3,
        "code": "cafe"
    }, {
        "id": 1,
        "code": "gate"
    }, {
        "id": 2,
        "code": "membership"
    }, {
        "id": 4,
        "code": "store"
    }
    ],
    "tags": [{
        "id": 1,
        "description": "Facility",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 6,
            "tag_id": 1
        }
    }, {
        "id": 6,
        "description": "Local event",
        "venue_id": 0,
        "owner_id": 0,
        "pivot": {
            "note_id": 6,
            "tag_id": 6
        }
    }
    ]
}
]
;

function NoteEvent({ event }) {
    var className = "NoteEvent";
    var style = {};
    if (event.length >= 1) {
        className += " multiday";
    } else {
        var size = 5.5 * Math.pow(1.45454545454545, event.dateCount);
        size = Math.min(36, size);
        // console.log(event.dateCount, (1.25 ^ event.dateCount), size);
        style.width = size+"px";
        style.height = size+"px";
        
        if(event.firstOneDay && event.dateCount<=2) {
            className += " revealed";
        }
        
    };
    return (
        <Circle style={style} className={className}/>
    )
}

function ShowMore(n) {
    var size = 5.5 * Math.pow(1.45454545454545, n+1);
    size = Math.min(36, size);
    var style = {width:size+"px", height:size+"px"};
    var className = "NoteEvent ShowMore";
    return (
        <Circle style={style} className={className}/>
    )
}


var DayBG = $('<div class="DayBG"></div>');

var NoteRow = React.createClass({
    getInitialState:function () {
        return {
            expanded:false,
            userID: KAPI.auth.getUser().id,
            permissions: KAPI.auth.getUserPermissions()
        } 
    },
    expandNote:function() {
        this.setState({
            expanded:!this.state.expanded
        })
    },
    onNoteDelete:function (e) {
        if (!confirm("Delete this note?")) {
            return;
        }
        var id = this.props.event.data.id;
        KAPI.notes.delete(id, wnt.venueID, this.onNoteDeleted);
    },
    onNoteDeleted:function (response) {
        alert("The note has been deleted.");
        this.props.onNoteDeleted();
    },
    render:function () {
        
        var expanded = this.state.expanded;
        
        var event = this.props.event;
        var data = event.data;
        var start = moment(event.start);
        var end = moment(event.end);
        var lengthInDays = event.length;
        var author = this.props.authorList[data.owner_id];
        var hours = "All Day";
        
        if (!event.allDay) {
            var startFormat = ("h");
            if( start.format("a") != end.format("a") ) {
                startFormat = ("h a");
            }
            hours = start.format(startFormat) + " - " + end.format("h a");
        }
        
        var tags = [];
        for (var k in data.tags) {
            var tag = data.tags[k];
            tags.push(
                <div key={k} className={"tag"} id={tag.id}>{tag.description}</div>
            );
        }
        
        var channels = [];
        for (var l in data.channels) {
            var channel = data.channels[l];
            channels.push(
                <div key={l} className={"channel "+channel.code} id={channel.id} title={channel.code}></div>
            );
        }
        
        if (this.state.permissions["users-manage"] || data.owner_id == this.state.userID) {
            var editable = true;
        }
        // console.log(lengthInDays);
        
        return (
            <div className={"note-row clearfix" + (expanded ? " expanded":"")}>
                <div className="col-xs-2 note-date">
                    <div className="date-container">
                    {start.format("DD.MM")}{(lengthInDays > 0) ? "- "+end.format("DD.MM") :  ""}
                    </div>
                </div>
                <div className="col-xs-9">
                    <div className="col-xs-7 note-content">
                        <div className="note-header">{data.header}</div>
                        <div className="note-time">{hours}</div>
                        <div className="note-author">{author}</div>
                    </div>
                    <div className="col-xs-4 tags">{tags}</div>
                    <div className="col-xs-1 channels">{channels}</div>
                    <div >
                        <div className="col-xs-11 note-description" >
                            <p>{data.description}</p>
                    { false ?
                            <div className="related-events">
                                <div><span className="tag">Facility Sep 02, 2016</span> <strong>Fire in the hall</strong></div>
                                <div><span className="tag">Facility Sep 02, 2016</span> <strong>Fire in the hall</strong></div>
                            </div>
                        :
                        <div></div>
                    }
                        </div>
                        <div className="col-xs-1 edit-delete">
                            {(editable) ?
                            <span>
                                <EditIcon onClick={(e)=>this.props.onNoteEdit(data)} className="edit-icon"  /> 
                                <SVGButton 
                                    className={"circle delete vertical-middle"} 
                                    onClick={this.onNoteDelete} icon={<SlimMinusSign />} 
                                />
                            </span>
                            : 
                                <span></span>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-xs-1 expand-note"><div onClick={this.expandNote} className="caret-container"><Caret className=""/></div></div>
                
            </div>
        );
    }
});

var NotesCalendarModal = React.createClass({
    getInitialState:function () {
        var defaultDate = new Date(this.props.defaultDate);
        var week = this.getWeek(defaultDate);
        var today = new Date(du.localFormat(wnt.today));
                
        var state = {
			currentDate:moment(defaultDate),
            events:[],
            week:week,
            calendarView:true,
            today:today,
            noteExpandedData:null,
            monthStart:null
        };
        return(
            state
        ); 
    },
    getWeek:function (date) {
        var start = moment(date).startOf('week');
        var end = moment(date).endOf('week');
        return {start:start, end:end};
    },
    getNotes(date, events) {
        if (!events) {
            events = this.state.events;
        }
        
        var dateStart = moment(date).startOf('day');
        var dateEnd = moment(date).endOf('day');
        var notes = []
        // console.log(events);
        for (var i=0; i<events.length; i++) {
            var evt = events[i];
            var evtStart = moment(evt.start);
            var evtEnd = moment(evt.end);
            // console.log(dateStart, evt.start, evt.end);
            if ( 
                (evtEnd.isBetween(dateStart, dateEnd) || evtEnd.isSame(dateEnd))                //el evento termina ese dia
                ||
                (evtStart.isBetween(dateStart, dateEnd) || evtStart.isSame(dateStart))          //el evento comienza ese dia
                ||
                dateStart.isBetween(evtStart, evtEnd)                                           //el evento abarca el comienzo del dia
                ||
                dateEnd.isBetween(evtStart,evtEnd)                                              //el evento abarca la finalizacion del dia
            ) {
                notes.push(<NoteRow onNoteEdit={this.props.onNoteEdit} onNoteDeleted={()=>this.updateNotes(this.state.currentDate, true)} expandNote={this.expandNote} key={i} event={evt} authorList={this.props.authorList} />)
            }
        }
        return notes;
    },
    updateNotes:function (date, forceUpdate) {
        var monthStart = moment(date).startOf('month').format('YYYY-MM-DD');
        var monthEnd = moment(date).endOf('month').format('YYYY-MM-DD');
        
        if (!forceUpdate && monthStart == this.state.monthStart) return;
        
        this.setState({monthStart:monthStart});
        
        KAPI.notes.list(wnt.venueID, monthStart, monthEnd, this.onNotesUpdated);
    },
    onNotesUpdated:function (result) {
        // result  = eventsTest;
        var events = [];
        
        var lastDate = "";
        var dateCount = 0;
        var firstFound = false;
        
        for (var i=0; i<result.length; i++) {
            var r = result[i];
            var start = moment(r.time_start);
            var end = moment(r.time_end);
            var currentDate = start.format('YYYY-MM-DD');
            var firstOneDay = false;
            
            if(lastDate!=currentDate) {
                lastDate=currentDate;
                dateCount=0;
                firstFound = false;
            } else {
                events[events.length-1].lastInDate = false;
            }
            
            var eventLength = (end.startOf("day").diff(start.startOf("day"), 'days'));
            dateCount++;
            
            if (!firstFound && eventLength < 1) {
                firstFound = true;
                firstOneDay = true;
            }
            
            events.push({
                'title': r.header,
                'allDay': r.all_day ? true : false,
                'start': start.toDate(),
                'end': end.toDate(),
                'length': eventLength,
                'data': r,
                dateCount:dateCount,
                lastInDate:true,
                firstOneDay:firstOneDay
            })
        }
        
        var lastCount = 1;
        for (var i=events.length-1; i>=0; i--) {
            var e = events[i];
            if (e.lastInDate) {
                lastCount = e.dateCount;
            } else {
                e.dateCount = lastCount;
            }
        }
        // console.log(events);
        
        this.setState({events:events, notes:this.getNotes(this.state.currentDate, events)});
    },
    updateDate:function (date) {
        this.updateNotes(date);
        this.props.onSelectDate(date);
        this.setState({currentDate:moment(date), week:this.getWeek(date), notes:this.getNotes(date)});
    },
    monthChange:function (e, n) {
        var newDate = new Date(du.addMonths(this.state.currentDate.toDate(), n));
        this.updateDate(newDate);
        this.updateNotes(newDate);
    },
    addNote:function(e) {
        e.preventDefault();
        this.props.onNoteEdit(null);
    },
    onDateChange:function (e) {
        // console.log(e);
        // e.preventDefault();
        this.updateDate(e);
    },
    onSelectNote:function (e) {
        // console.log(e);
        this.updateDate(e.start);
    },
    onSelectSlot:function (e) {
        console.log(e);
    },
    onSelecting:function (e) {
        console.log(e);
    },
    expandNote:function(note) {
        this.setState({noteExpandedData:note});
    },
    toggleCalendarView:function (e) {
        this.setState({calendarView:!this.state.calendarView})
    },
    show:function() {
        $(getDOMNode(this)).modal("show");
        this.props.onSelectDate(this.state.currentDate);
        this.updateNotes(this.state.currentDate, true);
    },
    hide:function() {
        $(getDOMNode(this)).modal("hide");
    },
    componentWillReceiveProps:function (nextProps) {
        if(nextProps.defaultDate != this.props.defaultDate) {
            var currentDate = new Date(du.localFormat(nextProps.defaultDate));
            
            this.setState({currentDate:moment(currentDate)})
        }
        
        if (nextProps.show  == this.props.show) return;
        
        
        if(nextProps.show) {
            this.show();
        } else {
            this.hide();
        }
    },
    componentDidMount:function () {
        $(getDOMNode(this)).on('hide.bs.modal', this.props.onClose);
        if(this.props.show) {
            this.show();
        }
    },
	componentDidUpdate:function(){
        var current = $(getDOMNode(this.refs.BigCalendar)).find(".rbc-current");
        // console.log(this.refs.BigCalendar, current, DayBG);
        $(current).append(DayBG);
	},
    render:function () {
        
        var currentDate = this.state.currentDate.format("MMMM, YYYY")
        
        return(
            <div className="modal fade" tabIndex="-1" role="dialog">
              <div className="modal-dialog" id="calendar-modal" role="document">
                <div className="modal-content" >
                  <div className="modal-header modal-section">
                    <div className="top-bar">
                        <button type="button" style={{display:"none"}} className="close" data-dismiss="modal" aria-label="Close"><CloseIcon className="close-icon"/></button>
                        <h3 className="modal-title inline-block">{currentDate}</h3>
                        <div id="month-switch" className="inline-block">
                            <div className="inline-block" onClick={(e) => this.monthChange(e, -1)}>
                                <Caret className="left-caret"/>
                            </div> 
                                Month 
                            <div className="inline-block" onClick={(e)=>this.monthChange(e, +1)}>
                                <Caret  className="right-caret" />
                            </div>
                        </div>
                        <div id="select-wrapper" className="inline-block">
                        {false ? 
                            <Select
                                ref="categorySelect"
                                name="category-select"
                                placeholder="Choose a category"
                                options={this.state.categoryList}
                                onChange={this.onCategorySelect}
                                clearable={false}
                                searchable={false}
                                openOnFocus={true}
                                arrowRenderer={function(){return(<Caret className="filter-caret" />)}}
                                optionRenderer={this.optionRenderer}
                                onClose={this.onCategorySelectClose}
                                onBlur={this.onCategorySelectBlur}
                                onOpen={this.onCategorySelectOpen}
                            />
                        :   <div></div>
                        }
                        </div>
                    </div>
                    <div className="clearfix"></div>
                    <div className={this.state.calendarView? "calendar": "calendar folded"}>
                        <BigCalendar
                            ref="BigCalendar"
                            components={{event:NoteEvent}}
                            messages={{showMore:ShowMore}}
                            popup={false}
                            selectable={true}
                            timeslots={2}
                            showAllEvents={false}
                            toolbar={false}
                            views={['month']}
                            date={this.state.currentDate.toDate()}
                            events={this.state.events}
                            now={this.state.today}
                            onNavigate={this.onDateChange}
                            onSelectEvent={this.onSelectNote}
                            onSelectSlot={this.onSelectSlot}
                            onSelecting={this.onSelecting}
                        />
                    </div>
                    <div className="clearfix"></div>
                    <div className="date-bar">
                        <a href="#" onClick={null}><div className="week inline-block">
                            {this.state.week.start.format("MMM DD")} - {this.state.week.end.format("MMM DD")}, {this.state.week.start.format("YYYY")}
                        </div></a>
                        <div className="date inline-block">&nbsp;&nbsp;|&nbsp;&nbsp;{this.state.currentDate.format("dddd MMM Do, YYYY")}</div>
                        <div className={"float-right" + (this.state.calendarView ? "":" active") } id="toggle-expand" onClick={this.toggleCalendarView}>
                            <Caret className=""/>
                        </div>
                        <div className="float-right" id="add-note" onClick={this.addNote} onMouseEnter={this.showNoteTipIcon} onMouseLeave={this.hideNoteTipIcon}>
                            <NoteIcon className="note-icon" /> 
                            <AddNoteTip  onAddNote={this.addNote} ref="addNoteTipIcon" left="5px" fadein={this.state.noteTipIcon}/>
                        </div>
                    </div>
                  </div>
                  <div className={"modal-body modal-section" + (this.state.calendarView? "": " expanded")}>
                        <div className="note-rows-container">
                            {this.state.notes}
                        </div>
                  </div>
                </div>
              </div>
            </div>
        );
    }
});

module.exports = NotesCalendarModal;