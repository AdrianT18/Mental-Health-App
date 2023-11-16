const {getCondition} = require("./conditionSearch.service")

module.exports = {

    getConditionResponse: async (req, res) => {

        try{
            let results = await getCondition();  //get response body from the getCondition function in services file
            res.json(results);  //extract data as json objects
        } catch(error){
            console.log(error);
            res.status(500); //return status 500 if there is error
        }
    },
    
   
};

