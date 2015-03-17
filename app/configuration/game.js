/**
 * Created by Miro on 17.11.2014.
 */
missing.module('HandBattle').configuration('GameConfig', {
    "games": {
        "default": {
            "options": ["rock", "paper", "scissor"],
            "superiority": {
                "rock": ["scissor"],
                "paper": ["rock"],
                "scissor": ["paper"]
            }
        },
        "sheldon":{
            "options": ["rock", "paper", "scissor", "lizard", "spock"],
            "superiority": {
                "rock": ["scissor", "lizard"],
                "paper": ["rock", "spock"],
                "scissor": ["paper", "lizard"],
                "lizard": ["paper", "spock"],
                "spock": ["rock", "scissor"]
            }
        }
    },
    "languages":["en","rs"],
    "modes":["human","computer"]
});