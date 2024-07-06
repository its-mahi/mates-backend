const express = require('express');
const answer = require('../models/Answer');

const fetchuser = require('../middleware/fetchuser');
const Answer = require("../models/Answer");
const { route } = require('./questions');
const User = require("../models/User");

const Question = require("../models/Question");
const router = express.Router();
const mongoose = require('mongoose')

var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

router.post('/addanswer/:id', fetchuser, async (req, res) => {
    try {

        // console.log(req.params.id);
        let newanswer = await Answer.create({
            questionid: req.params.id,
            answer: req.body.answer,
            postedId: req.user.id,
            postedBy: req.user.username,
            votes: 0
        })

        res.json({ "Success": "Added Answer Successfully", "status": true })
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post('/points', fetchuser, async (req, res) => {
    try {
        const username = localStorage.getItem("username");
        console.log("username : ", username);

        const answers = await Answer.find({ postedBy: username });
        console.log(answers);

        if (!answers) {
            return res.status(404).send("Answers not Found");
        }

        let points = 0;

        answers.map((ans) => {
            points += ans.votes;
        })

        res.json({ "points" : points })
    }
    catch (error) {
        console.log(error.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post("/fetchanswer", async (req, res) => {
    try {
        const answers = await Answer.find();
        res.json(answers);
    }

    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post("/fetchanswer/:id", async (req, res) => {
    try {
        const answers = await Answer.find({ questionid: req.params.id });
        res.json(answers);
    }

    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post('/fetchUserAnswers', async (req, res) => {
    try {

        const answers = await Answer.find();
        // console.log(answers);

        if (!answers) {
            return res.status(404).send("Question not Found");
        }

        res.json(answers);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/fetchUserAnswers/:username', async (req, res) => {
    try {

        const answers = await Answer.find({ postedBy: req.params.username });
        // console.log(answers);

        if (!answers) {
            return res.status(404).send("Question not Found");
        }

        res.json(answers);
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

// This is for filtering answeres based on Date,tag and status
router.post('/fetchUserFilteredAnswers/:username', async (req, res) => {
    try {

        const answers = await Answer.find({ postedBy: req.params.username });

        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const tags = req.body.tags;
        const status = req.body.status;

        if (!answers) {
            return res.status(404).send("Answers not Found");
        }

        const afterDateapplied = [];
        answers.map(ans => {
            const year = ans.date.getUTCFullYear();
            var month = ans.date.getUTCMonth() + 1;
            var day = ans.date.getUTCDate();

            if (month >= '0' && month <= '9') month = "0" + month;
            if (day >= '0' && day <= '9') day = "0" + day;

            const date = year + "-" + month + "-" + day;

            if (date >= startDate && date <= endDate) {
                afterDateapplied.push(ans);
            }
        })

        const afterTagsapplied = [];
        var tagAppiled = false;
        if (tags) {
            for (i in afterDateapplied) {
                const que = await Question.find({ _id: afterDateapplied[i].questionid });
                if (que[0].tags.split(" ").includes(tags)) {
                    afterTagsapplied.push(afterDateapplied[i]);
                }
            }
            tagAppiled = true;
        }

        const afterStatusApplied = [];
        var statusAppiled = false;
        if (status) {
            if (tagAppiled) {
                afterTagsapplied.map(ans => {
                    if (ans.status === status) {
                        afterStatusApplied.push(ans);
                    }
                })
            }
            else {
                afterDateapplied.map(ans => {
                    if (ans.status = status) {
                        afterStatusApplied.push(ans);
                    }
                })
            }
            statusAppiled = true;
        }

        if (statusAppiled)
            res.json(afterStatusApplied);
        else if (tagAppiled)
            res.json(afterTagsapplied);
        else {
            res.json(afterDateapplied);
        }
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/fetchAllFilteredAnswers', async (req, res) => {
    try {

        const answers = await Answer.find();

        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const tags = req.body.tags;
        const status = req.body.status;

        if (!answers) {
            return res.status(404).send("Answers not Found");
        }

        const afterDateapplied = [];
        answers.map(ans => {
            const year = ans.date.getUTCFullYear();
            var month = ans.date.getUTCMonth() + 1;
            var day = ans.date.getUTCDate();

            if (month >= '0' && month <= '9') month = "0" + month;
            if (day >= '0' && day <= '9') day = "0" + day;

            const date = year + "-" + month + "-" + day;

            if (date >= startDate && date <= endDate) {
                afterDateapplied.push(ans);
            }
        })

        const afterTagsapplied = [];
        var tagAppiled = false;
        if (tags) {
            for (i in afterDateapplied) {
                const que = await Question.find({ _id: afterDateapplied[i].questionid });
                if (que[0].tags.split(" ").includes(tags)) {
                    afterTagsapplied.push(afterDateapplied[i]);
                }
            }
            tagAppiled = true;
        }

        const afterStatusApplied = [];
        var statusAppiled = false;
        if (status) {
            if (tagAppiled) {
                afterTagsapplied.map(ans => {
                    if (ans.status === status) {
                        afterStatusApplied.push(ans);
                    }
                })
            }
            else {
                afterDateapplied.map(ans => {
                    if (ans.status = status) {
                        afterStatusApplied.push(ans);
                    }
                })
            }
            statusAppiled = true;
        }

        if (statusAppiled)
            res.json(afterStatusApplied);
        else if (tagAppiled)
            res.json(afterTagsapplied);
        else {
            res.json(afterDateapplied);
        }
    }
    catch (e) {
        console.log(e.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post("/givenAllAnswersTags", async (req, res) => {
    try {
        const answers = await Answer.find();

        const questions = [];

        for (i in answers) {
            const question = await Question.find({ _id: answers[i].questionid });
            questions.push(question);
        }
        const tags = [];

        questions.map(que => {
            que[0].tags.split(" ").map(tag => {
                if (tags.indexOf(tag) == -1) tags.push(tag);
            })
        })

        res.json(tags);
    }
    catch (e) {
        
        res.status(400).send("Internal Server Error");
    }
})


router.post("/givenAnswersTags/:username", async (req, res) => {
    try {
        const answers = await Answer.find({ postedBy: req.params.username });

        const questions = [];

        for (i in answers) {
            const question = await Question.find({ _id: answers[i].questionid });
            questions.push(question);
        }
        const tags = [];

        questions.map(que => {
            que[0].tags.split(" ").map(tag => {
                if (tags.indexOf(tag) == -1) tags.push(tag);
            })
        })

        res.json(tags);
    }
    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})




router.post("/upvote/:id", async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        const vote = answer["votes"] + 1;

        const updatedAnswer = await Answer.findByIdAndUpdate(req.params.id, { $set: { "votes": vote } });

        res.json({ "status": "upvoted" });
    }

    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

router.post("/fetchVotes", async (req, res) => {
    const allAnswers = await Answer.find();
    const obj = {};

    allAnswers.map(ans => {
        obj[ans._id] = ans.votes;
    })
    res.json(obj);
})

router.post("/downvote/:id", async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        const vote = answer["votes"] - 1;

        const updatedAnswer = await Answer.findByIdAndUpdate(req.params.id, { $set: { "votes": vote } });

        res.json({ "status": "downvoted" });
    }

    catch (e) {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})



router.post("/deleteans/:id", async(req, res)=>{
    try{
        await Answer.deleteOne({_id : req.params.id});

        res.json({"status":"deleted"})
    }
    catch(e)
    {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})


router.post("/findNumberOfAns", async(req, res)=>{
    try{
        const allAnswers = await Answer.find();
        const obj = {};

        allAnswers.map(ans => {
            if(obj[ans.questionid])
            {
                obj[ans.questionid] = obj[ans.questionid] + 1;
            }
            else
            {
                obj[ans.questionid] = 1;
            }
        })
        
        console.log(obj);

        res.json(obj);
    }
    catch(e)
    {
        console.log(e.message);
        res.status(400).send("Internal Server Error");
    }
})

module.exports = router