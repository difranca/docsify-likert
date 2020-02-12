// eslint-disable-next-line no-unused-vars
import styles from './styles.css';

(function () {
    const CONFIG = {
        question:'How satisfied were you with this page information?',

        img1: 'https://github.githubassets.com/images/icons/emoji/tired_face.png',
        img2: 'https://github.githubassets.com/images/icons/emoji/sweat.png',
        img3: 'https://github.githubassets.com/images/icons/emoji/neutral_face.png',
        img4: 'https://github.githubassets.com/images/icons/emoji/smile.png',
        img5: 'https://github.githubassets.com/images/icons/emoji/heart_eyes.png',

        val1: '1',
        val2: '2',
        val3: '3',
        val4: '4',
        val5: '5',

        alt1: 'Very Unsatisfied',
        alt2: 'Unsatisfied',
        alt3: 'Neutral',
        alt4: 'Satisfied',
        alt5: 'Very Satisfied',

        message: 'Thanks for your support!',
    };

    function mergeObjects(obj1, obj2, level = 0) {
        for (const property in obj2) {
            try {
            if (obj2[property].constructor === Object && level < 1) {
                obj1[property] = mergeObjects(obj1[property], obj2[property], level + 1);
            } else {
                obj1[property] = obj2[property];
            }
            } catch(e) {
            obj1[property] = obj2[property];
            }
        }
        return obj1;
    }

    const install = function (hook, vm) {

        const options = mergeObjects(CONFIG, vm.config['likert'] || vm.config.likert);

        const findSetting = function findLikertSetting(input, key, fallback, callback) {
            const match = (input || '').match(new RegExp(`${key}:(([\\s\\w\\u00A0-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFEF-]*))`));

            if (!match) {
                return callback ? callback(fallback) : fallback;
            }

            return callback ? callback(match[1]) : match[1];
        };

        hook.afterEach(function (html, next) {

            const modHtml = html.replace(/<!--\s*LIKERT\s*-->/g, function (match, key, settings, value) {

                if (!options) {
                    return match;
                }
                
                const question = findSetting(settings, 'question', options.question);
                const img1 = findSetting(settings, 'img1', options.img1);
                const img2 = findSetting(settings, 'img2', options.img2);
                const img3 = findSetting(settings, 'img3', options.img3);
                const img4 = findSetting(settings, 'img4', options.img4);
                const img5 = findSetting(settings, 'img5', options.img5);
                const val1 = findSetting(settings, 'val1', options.val1);
                const val2 = findSetting(settings, 'val2', options.val2);
                const val3 = findSetting(settings, 'val3', options.val3);
                const val4 = findSetting(settings, 'val4', options.val4);
                const val5 = findSetting(settings, 'val5', options.val5);
                const alt1 = findSetting(settings, 'alt1', options.alt1);
                const alt2 = findSetting(settings, 'alt2', options.alt2);
                const alt3 = findSetting(settings, 'alt3', options.alt3);
                const alt4 = findSetting(settings, 'alt4', options.alt4);
                const alt5 = findSetting(settings, 'alt5', options.alt5);
                const message = findSetting(settings, 'message', options.message);

                const likertDiv = `
                    <div id='likert' class='likert'>
                        <p align='center' class='likert-question'>${question}</p>
                        <p>
                            <div id='likert-buttons' align='center'>
                                <button onclick='likertClick(${val1})' class='likert-button'>
                                    <img class='emoji' src='${img1}' alt='${alt1}'>
                                </button>
                                <button onclick='likertClick(${val2})' class='likert-button'>
                                    <img class='emoji' src='${img2}' alt='${alt2}'>
                                </button>
                                <button onclick='likertClick(${val3})' class='likert-button'>
                                    <img class='emoji' src='${img3}' alt='${alt3}'>
                                </button>
                                <button onclick='likertClick(${val4})' class='likert-button'>
                                    <img class='emoji' src='${img4}' alt='${alt4}'>
                                </button>
                                <button onclick='likertClick(${val5})' class='likert-button'>
                                    <img class='emoji' src='${img5}' alt='${alt5}'>
                                </button>
                            </div>
                            <div id='likert-thanks' align='center' class='likert-thanks'>
                                <span>${message}</span>
                            </div>
                        </p>
                    </div>
                `;

                return likertDiv;
            });
            next(modHtml);
        });

        hook.doneEach(function() {
            var likertBtns = document.getElementsByClassName('likert-button');           

            for (let item of likertBtns) {
                
                item.addEventListener("click", function() {
                    var likertButtons = document.getElementById('likert-buttons');
                    var likertThanks = document.getElementById('likert-thanks');

                    likertButtons.style.visibility = 'collapse';
                    likertButtons.style.height = '0px';
                    likertThanks.style.visibility = 'visible';
                    likertThanks.style.height = '100%';
                });
            }
        });
    };

    window.$docsify = window.$docsify || {};
    window.$docsify.plugins = [].concat(install, window.$docsify.plugins);

}());

