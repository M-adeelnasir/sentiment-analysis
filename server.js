const express = require('express');
const natural = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');
const aposToLexForm = require('apos-to-lex-form');

const app = express()


const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

app.get('/analyzer', function (req, res) {

    let review = "super super ver very great product"


    const lexedReview = aposToLexForm(review);
    const casedReview = lexedReview.toLowerCase();
    const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
    const { WordTokenizer } = natural;
    const tokenizer = new WordTokenizer();
    const tokenizedReview = tokenizer.tokenize(alphaOnlyReview);
    tokenizedReview.forEach((word, index) => {
        tokenizedReview[index] = spellCorrector.correct(word);
    })
    const filteredReview = SW.removeStopwords(tokenizedReview);

    const { SentimentAnalyzer, PorterStemmer } = natural;
    const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    const analysis = analyzer.getSentiment(filteredReview);

    res.status(200).json({ analysis });

});


app.listen(4000, () => {
    console.log("server listening");
})