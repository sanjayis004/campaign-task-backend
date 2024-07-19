const express = require('express')
const router = express.Router()

const campaignController = require('../controllers/campaign.controller.js')


router.get('/api/campaigns',campaignController.getCampaigns)
router.post('/api/campaigns',campaignController.createCampaign)
router.put('/api/campaigns/:id',campaignController.updateCampaign)


module.exports = router