const calculateResultsDiagnosisScript = async (rawDiagnostic) => {


  const anxiety = rawDiagnostic.responses_value;

  console.log("anxiety", anxiety);

  /*
    hostility      
    depression     
    social_anxiety 
    impulsivity    
    vulnerability  
  
    cordiality         
    gregariousness     
    assertiveness      
    activity           
    excitement_seeking 
    positive_emotions  
  
    fantasy                
    aesthetic_appreciation 
    feelings               
    actions                
    ideas                  
    values                 
  
    trust                 
    frankness             
    altruism              
    conciliatory_attitude 
    modesty               
    sensitivity_to_others 
  
    competence           
    orderliness          
    sense_of_duty        
    need_for_achievement
    self_discipline      
    deliberation         
  */


}

module.exports = { calculateResultsDiagnosisScript };