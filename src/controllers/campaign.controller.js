const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const { PrismaClient } = require('@prisma/client');
const Common = require('../helpers/common')
const prisma = new PrismaClient();


module.exports.getCampaigns = async(req, res) => {
	const schema =  Joi.object().keys({
		body:{

		},
		query:{}
	})
    const result = schema.validate({
        query: req.query,
        body: req.body
    })
    const error = result.error
    if (error) {
        return res.json({
            success: false,
            error: result.error.details[0].message,
            message: "",
            data: []
        })
    } else {
        const campaigns = await prisma.campaign.findMany({
            include: {
                schedule: true
            }
        });
        const campaignsWithNextActivation = campaigns.map(campaign => ({
      ...campaign,
      nextActivation: Common.getNextActivation(campaign.schedule, campaign.startDate, campaign.endDate), // Calculate next activation
    }));

    res.json(campaignsWithNextActivation);
    }

}


module.exports.createCampaign = async(req, res) => {
	const schema =  Joi.object().keys({
		body:{
			type:Joi.string().required(),
            startDate:Joi.string().required(),
            endDate:Joi.string().required(),
            schedule:Joi.array().required()
		},
		query:{}
	})
    const result = schema.validate({
        query: req.query,
        body: req.body
    })
    const error = result.error
    if (error) {
        return res.json({
            success: false,
            error: result.error.details[0].message,
            message: "",
            data: []
        })
    } else {
        const {
            type,
            startDate,
            endDate,
            schedule
        } = req.body;
        const newCampaign = await prisma.campaign.create({
            data: {
                type,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                schedule: {
                    create: schedule,
                },
            },
        });
        res.json(newCampaign)
    }
}

module.exports.updateCampaign = async(req,res)=>{
	const schema =  Joi.object().keys({
		body:{
			type:Joi.string().required(),
            startDate:Joi.string().required(),
            endDate:Joi.string().required(),
            schedule:Joi.array().required()
		},
		query:{}
	}).options({allowUnknown:true})
    const result = schema.validate({
        query: req.query,
        body: req.body
    })
    const error = result.error
    if (error) {
        return res.json({
            success: false,
            error: result.error.details[0].message,
            message: "",
            data: []
        })
    } else {
	const { id } = req.params;
	  const { type, startDate, endDate, schedule } = req.body;
	  const updatedCampaign = await prisma.campaign.update({
	  where: { id: parseInt(id) },
	  data: {
	    type,
	    startDate: new Date(startDate),
	    endDate: new Date(endDate),
	    // For relational updates, nested writes with deleteMany and create
	    schedule: {
	      deleteMany: {}, // Deletes all related schedules
	      create: schedule.map(item => ({
	        day: item.day,
	        startTime: item.startTime,
	        endTime: item.endTime,
	      })),
	    },
	  },
	});
	  res.json(updatedCampaign);
	}
}