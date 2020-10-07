const CDN_URL = 'https://cdn.betterttv.net/emote/';

const url = chrome.runtime.getURL('data/emotes.json')

let all_emotes;

fetch(url).then((response) => response.json()).then((json) => {
    all_emotes = json
})

function updatePastMessages(element) {
    let messages = element.querySelectorAll('.chat-message__body');
    for (let message of messages) {
        message.innerHTML = replaceEmoticons(message.innerHTML)
    }
}

function replaceEmoticons(text) {
    let returnText = [];

    for (let word of text.split(' ')) {
        let result = all_emotes.find(element => element.code === word)
        if (result) {
            returnText.push('<img data-toggle="tooltip" src="' + CDN_URL + result.id + '/1x" alt="' + result.code + '"/>');
        } else {
            returnText.push(word);
        }
    }

    return returnText.join(' ');
}

// Without jQuery
// Define a convenience method and use it
var ready = (callback) => {
    if (document.readyState !== "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
}

ready(() => {
    console.log("TwitchBB Loaded! v1.1")

    let checkExist = setInterval(function () {
        let element = document.querySelector('.side-panels.offcanvas-right');
        if (element) {
            const observer = new MutationObserver(screenUpdatedCallback);
            // Start observing the target node for configured mutations
            observer.observe(element, config);
            clearInterval(checkExist);
        }
    }, 100); // check every 100ms

    const config = {childList: true};

    const screenUpdatedCallback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length) {
                let element = document.getElementById('chat-channel-history');
                if (element) {
                    updatePastMessages(element);
                    const observer = new MutationObserver(chatUpdatedCallback);
                    // Start observing the target node for configured mutations
                    observer.observe(element, config);
                }
            }
        }
    };

    const chatUpdatedCallback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length) {
                let target = mutation.addedNodes[0]

                let message = target.getElementsByClassName("chat-message__body")

                if (message === undefined) return;

                if (message.length > 0) {
                    setTimeout(function () {
                        message[0].innerHTML = replaceEmoticons(message[0].innerHTML)
                    }, 1, message)
                }
            }
        }
    };
});
