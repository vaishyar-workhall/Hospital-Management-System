const {getConnection}=require('../startup/db');
const {getDate}=require('./query.service');

const getPatientReport=async(req,res)=>{
    const db=await getConnection();
    const filters=getDate(req.query);
    if(req.query.city || req.query.diagnosis)
    {
        let conditions={};
        if(req.query.city) {
            conditions['address.city']=req.query.city;
        }
        const result=await db.collection('patients').aggregate([
            {$match:conditions},
            {$lookup:{
                    from:'records',
                    localField:'_id',
                    foreignField:'patientId',
                    as:'details'
                }
            },
            {$unwind:'$details'},
            {$match:req.query.diagnosis?{'details.diagnosis':req.query.diagnosis}:{}},
            {$group:{
                    _id:{diagnosis:'$details.diagnosis',
                        city:'$address.city'},
                    count:{$sum:1}
                }
            },
            {$project:{
                'diagnosis':'$_id.diagnosis',
                'city':'$_id.city',
                'count':1,
                '_id':0
            }
            }
        ]).toArray();
        res.status(200).send(result);
    }    
    else{
        const count = await db.collection('patients').countDocuments(filters);
        const result = await db.collection('patients').find(filters).toArray();
        res.status(200).send({'count':count,'Data':result});
    }
}

const getAppointmentReport=async(req,res)=>{
    const db=await getConnection();
    const filters=getDate(req.query);
    const count = await db.collection('appointments').countDocuments(filters);
    const result = await db.collection('appointments').find(filters).toArray();
    res.status(200).send({'count':count,'Data':result});
}

const getDoctorReport=async(req,res)=>{
    const db=await getConnection();
    const filters=getDate(req.query);
    const count = await db.collection('doctors').countDocuments(filters);
    const result = await db.collection('doctors').find(filters).toArray();
    res.status(200).send({'count':count,'Data':result});
}

const getRecordsReport=async(req,res)=>{
    const db=await getConnection();
    const filters=getDate(req.query);
    const count = await db.collection('records').countDocuments(filters);
    const result=await db.collection('records').find(filters).toArray();
    res.status(200).send({'count':count,'Data':result});
}

module.exports={
    getPatientReport,
    getAppointmentReport,
    getDoctorReport,
    getRecordsReport
}
