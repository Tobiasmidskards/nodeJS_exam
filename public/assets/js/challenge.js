class Picker {
    state;
    styles;
    start;
    challenge;
    result;
    error;

    recipe;

    resultStyle;
    resultName;
    resultLink;
    resultDescription;
    resultPrepTime;
    resultLikes;
    
    firstButton;
    secondButton;

    likeButton;

    contestants;

    constructor() {
        this.state = 0;
        this.styles = [];
        this.start = $('#start');
        this.challenge = $('#challenge');
        this.result = $('#result');
        this.error = $('#error');

        this.firstButton = $('#first');
        this.secondButton = $('#second');
        this.likeButton = $('#likeButton');

        this.resultStyle = $('#style');
        this.resultName = $('#name');
        this.resultLink = $('#link');
        this.resultDescription = $('#description');
        this.resultPrepTime = $('#prepTime');
        this.resultLikes = $('#likes');

        this.contestants = [];

        this.nextState();
        this.fetchStyles();
    }

    get state() {
        return this.state;
    }

    nextState() {
        this.state += 1;

        switch(this.state) {
            case 1:
                this.challenge.hide();
                this.result.hide();
                this.error.hide();
                break;
            case 2:
                this.start.hide();
                this.challenge.show();
                this.runChallenge();
                break;
            case 3:
                this.challenge.hide();
                this.fetchResult();
                this.result.show();
                break;
            case 4:
                this.challenge.hide();
                this.result.hide();
                this.error.show();
        }
    }

    runChallenge(loserIndex = undefined) {
        if (loserIndex !== undefined) {
            let loser = this.styles.find(style => style.id === this.contestants[loserIndex].id)

            let removeIndex = this.styles.map(function(item) { return item.id; }).indexOf(loser.id);
            this.styles.splice(removeIndex, 1);
        }

        if (this.styles.length > 1) {
            this.contestants = [];
            let first = this.styles[Math.floor(Math.random() * this.styles.length)];
            let second = first;
        
            while (first.id == second.id) {
                second = this.styles[Math.floor(Math.random() * this.styles.length)];
            }

            this.contestants.push(first);
            this.contestants.push(second);

            this.firstButton.text(first.name);
            this.secondButton.text(second.name);
        } else {
            this.nextState();
        }
    }

    fetchStyles() {
        $.ajax('/styles')
        .done((response) => {
            this.styles = response.styles;
        })
    }

    fetchResult() {
        $.ajax('/challenge/result/' + this.styles[0].id)
        .done((response) => {
            if (this.recipe !== undefined && this.recipe.id === response.recipe.id) {
                return this.fetchResult();
            }

            this.recipe = response.recipe;

            if (this.recipe !== undefined) {
                this.resultName.text(this.recipe.name);
                this.resultDescription.text(this.recipe.description);
                this.resultStyle.text(this.recipe.style.name);
                this.resultLink.attr('href', this.recipe.link);
                this.resultPrepTime.text(`${this.recipe.prepTime} mins.`);
                this.resultLikes.text(`${this.recipe.likes} likes`);

                this.likeButton.prop('disabled', false);
                this.likeButton.css('background-color', '')
                this.likeButton.css('border-color', '')
            } else {
                this.nextState();
            }
        })
    }

    reset() {
        location.reload();
    }

    like() {
        $.ajax('/recipes/like/' + this.recipe.id)
        .done((response) => {
            if (response.response === "OK") {
                this.likeButton.prop('disabled', true);
                this.likeButton.css('background-color', '#008400')
                this.likeButton.css('border-color', '#008400')
                this.resultLikes.text(`${this.recipe.likes + 1} likes`);
            }
        })
    }
}

const picker = new Picker();