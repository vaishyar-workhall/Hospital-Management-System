const getDate=(query)=>{
    const {start_date,end_date}=query;
    let filters={}
    if(start_date||end_date)
    {
        filters.createdOn={};
        if(start_date)
        {
            filters.createdOn.$gte=new Date(start_date);
        }
        if(end_date)
        {
            filters.createdOn.$lte=new Date(end_date);
        }
        if (Object.keys(filters.createdOn).length===0) {
            delete filters.createdOn;
        }
    }
    return filters;
}

exports.getDate=getDate;