/**
* Sample transaction
* @param {org.diemanufacturing.place_manufacturer_rawmaterial} placeOrder
* @transaction
*/

 async function placeOrder(placeOrder) {
 
   if(placeOrder.po1.status== 'not_initiated'){
   //placeOrder.po1.owner= placeOrder.newowner;
  placeOrder.po1.status= "initiated";
        placeOrder.po1.owner= placeOrder.newowner;
     placeOrder.po1.currentDate= new Date();
 placeOrder.po1.expDelivery.setDate(placeOrder.po1.currentDate.getDate() + placeOrder.po1.REPL_Time);
   }
   
   else if(placeOrder.po1.status== 'initiated')
   placeOrder.po1.status='confirmed';
   
//   placeOrder.po1.owner= placeOrder.newowner;
   
    return getAssetRegistry('org.diemanufacturing.place_order_of_Rawmaterial')
    .then (function (assetRegistry) {
    return assetRegistry.update(placeOrder.po1);
    })
   
   /* .then (function () {
    return getAssetRegistry('org.charity.Donor_Account');
    })
   
       .then (function (assetRegistry) {
    return assetRegistry.update(donor_manager.from);
    });
   */
    }



/**
* Sample transaction
* @param {org.diemanufacturing.supply_rawmaterial} supply_rawmaterial
* @transaction
*/

 async function supply_rawmaterial(supply_rawmaterial) {
var date= new Date();
 var dd=date.getDate();
 //    throw new window.alert(dd);
          
   var Edelivery= supply_rawmaterial.po1.expDeliveryDate.getDate();
 //    throw new window.alert(delivery);
   
   
   if(supply_rawmaterial.po1.status== 'confirmed'){
   supply_rawmaterial.raw.owner_raw_material= supply_rawmaterial.newowner;
   supply_rawmaterial.po1.status= 'delivering';
   }

   else if(supply_rawmaterial.po1.status=='delivering' && Edelivery==dd)
           {
            throw new window.alert("Order still not proceed ");
           }
   
   return getAssetRegistry('org.diemanufacturing.Raw_Material')
    .then (function (assetRegistry) {
    return assetRegistry.update(supply_rawmaterial.raw);
    })

   .then (function () {
    return getAssetRegistry('org.diemanufacturing.place_order_of_Rawmaterial');
    })
   
       .then (function (assetRegistry) {
    return assetRegistry.update(supply_rawmaterial.po1);
    });

 }

/**
* Sample transaction
* @param {org.diemanufacturing.delivery_of_rawmaterial} delivery_of_rawmaterial
* @transaction
*/

 async function delivery_of_rawmaterial(delivery_of_rawmaterial) {
var delivery_date= new Date();
 //var dd=date.getDate();
 //    throw new window.alert(dd);
          
   //var Edelivery= supply_rawmaterial.po1.expDeliveryDate.getDate();
 //    throw new window.alert(delivery);
   
   
   if(delivery_of_rawmaterial.po1.status== 'delivering'){
   delivery_of_rawmaterial.raw.owner_raw_material= delivery_of_rawmaterial.newowner;
   delivery_of_rawmaterial.po1.status= 'delivered';
   delivery_of_rawmaterial.po1.deliveryDate= delivery_date;
   delivery_of_rawmaterial.raw.status= 'delivered';  
   delivery_of_rawmaterial.raw.deliveryDate= delivery_date;  
   }

   /*else if(supply_rawmaterial.po1.status=='delivering' && Edelivery==dd)
           {
            throw new window.alert("Order still not proceed ");
           }
   */
   return getAssetRegistry('org.diemanufacturing.Raw_Material')
    .then (function (assetRegistry) {
    return assetRegistry.update(delivery_of_rawmaterial.raw);
    })

   .then (function () {
    return getAssetRegistry('org.diemanufacturing.place_order_of_Rawmaterial');
    })
   
       .then (function (assetRegistry) {
    return assetRegistry.update(delivery_of_rawmaterial.po1);
    });

 }




/**
* Sample transaction
* @param {org.diemanufacturing.rough_machining} rough_machining
* @transaction
*/

 async function rough_machining(rough_machining) { 
   var factory = getFactory();
   
if(rough_machining.raw.rawStatus== "rawstate" && rough_machining.raw.status=="delivered"){
   rough_machining.raw.rawStatus= "transform_to_component" ;
 //  rough_machining.component.component_id= rough_machining.raw.raw_material_id;
  var id= rough_machining.raw.raw_material_id;
        rough_machining.component = factory.newResource("org.diemanufacturing", "Component", id);

  rough_machining.component.State="rough machining";
   rough_machining.component.Process_Stage="rough machining";
    rough_machining.component.owner_component= rough_machining.manufacturer_owner;
  rough_machining.component.expDelivery = new Date();
  
  rough_machining.component.expDelivery.setDate(rough_machining.raw.deliveryDate.getDate() + 26);
  if(rough_machining.completedDate==4){
  rough_machining.component.actualDelivery =new Date();
  rough_machining.component.actualDelivery.setDate(rough_machining.raw.deliveryDate.getDate() + 4);
  }
  
  else{
rough_machining.component.actualDelivery =new Date();
  rough_machining.component.actualDelivery.setDate(rough_machining.raw.deliveryDate.getDate() + rough_machining.completedDate);
    document.write("Delayed in rough machining process");
    
    
  }
}
    return getAssetRegistry('org.diemanufacturing.Raw_Material')
    .then (function (assetRegistry) {
    return assetRegistry.update(rough_machining.raw);
    })

    .then (function () {
    return getAssetRegistry('org.diemanufacturing.Component');
    })
   
       .then (function (postAssetRegistry) {
    return postAssetRegistry.add(rough_machining.component);
    });

 }

/**
* Sample transaction
* @param {org.diemanufacturing.stress_relieving} stress_relieving
* @transaction
*/

 async function stress_relieving(stress_relieving) {

   if(stress_relieving.component.State=="rough machining"){
   stress_relieving.component.owner_component= stress_relieving.forger_owner;
   stress_relieving.component.State= "send for stress_relieving";
   stress_relieving.component.Process_Stage= "send for stress_relieving";
      
   
   }
    return getAssetRegistry('org.diemanufacturing.Component')
    .then (function (assetRegistry) {
    return assetRegistry.update(stress_relieving.component);
    })
   
 }

/**
* Sample transaction
* @param {org.diemanufacturing.supply_stress_relieving} supply_stress_relieving
* @transaction
*/

 async function supply_stress_relieving(supply_stress_relieving) {

  if(supply_stress_relieving.component.State=="send for stress_relieving"){ 
   supply_stress_relieving.component.owner_component= supply_stress_relieving.manufacturer_owner;
   supply_stress_relieving.component.State= "stress_relieving";
    supply_stress_relieving.component.Process_Stage= "stress_relieving";
 //  supply_stress_relieving.component.actualDelivery =new Date();
  
 if(supply_stress_relieving.completedDate==5){   supply_stress_relieving.component.actualDelivery.setDate(supply_stress_relieving.component.actualDelivery.getDate() + 5);}
    else{
     supply_stress_relieving.component.actualDelivery.setDate(supply_stress_relieving.component.actualDelivery.getDate() + supply_stress_relieving.completedDate); 
      
  document.write("Delayed in stress relieving process ");
    }
     }return getAssetRegistry('org.diemanufacturing.Component')
    .then (function (assetRegistry) {
    return assetRegistry.update( supply_stress_relieving.component);
    })
   
 }

/**
* Sample transaction
* @param {org.diemanufacturing.semi_finishing} semi_finishing
* @transaction
*/

 async function semi_finishing(semi_finishing) {

   if( semi_finishing.component.State== "stress_relieving")
   {
  // semi_finishing.component.owner_component= semi_finishing.Forger;
   semi_finishing.component.State= "semi_finished";
 semi_finishing.component.Process_Stage= "semi_finished";

     if(semi_finishing.completedDate==5){
      semi_finishing.component.actualDelivery.setDate(semi_finishing.component.actualDelivery.getDate() + 5);
     }
     else{
   semi_finishing.component.actualDelivery.setDate(semi_finishing.component.actualDelivery.getDate() + semi_finishing.completedDate);    
     document.write("Delayed in semi finishing process");
     }
   }
     return getAssetRegistry('org.diemanufacturing.Component')
    .then (function (assetRegistry) {
    return assetRegistry.update(semi_finishing.component);
    })
   
 }




/**
* Sample transaction
* @param {org.diemanufacturing.vaccum_treatment} vaccum_treatment
* @transaction
*/

 async function vaccum_treatment(vaccum_treatment) {

   if( vaccum_treatment.component.State== "semi_finished")
   {
   vaccum_treatment.component.owner_component= vaccum_treatment.heattreater_owner;
   vaccum_treatment.component.State= "send for vaccum_treatment";
   vaccum_treatment.component.Process_Stage= "send for vaccum_treatment";
    
   }
     return getAssetRegistry('org.diemanufacturing.Component')
    .then (function (assetRegistry) {
    return assetRegistry.update(vaccum_treatment.component);
    })
   
 }


/**
* Sample transaction
* @param {org.diemanufacturing.supply_vaccum_treatment} supply_vaccum_treatment
* @transaction
*/

 async function supply_vaccum_treatment(supply_vaccum_treatment) {

   if( supply_vaccum_treatment.component.State== "send for vaccum_treatment")
   {
   supply_vaccum_treatment.component.owner_component= supply_vaccum_treatment.manufacturer_owner;
   supply_vaccum_treatment.component.State= "vaccum_treatment";
supply_vaccum_treatment.component.Process_Stage= "vaccum_treatment";
    
     if(supply_vaccum_treatment.completedDate==4){
 supply_vaccum_treatment.component.actualDelivery.setDate(supply_vaccum_treatment.component.actualDelivery.getDate() + 4);
     }
     
     else{
supply_vaccum_treatment.component.actualDelivery.setDate(supply_vaccum_treatment.component.actualDelivery.getDate() + supply_treatment.completedDate);
       document.write("Delayed in vaccum treatment process");
     }
   }
     return getAssetRegistry('org.diemanufacturing.Component')
    .then (function (assetRegistry) {
    return assetRegistry.update(supply_vaccum_treatment.component);
    })
   
 }

/**
* Sample transaction
* @param {org.diemanufacturing.finishing} finishing
* @transaction
*/

 async function finishing(finishing) {

   if( finishing.component.State== "vaccum_treatment")
   {
   //finishing.component.owner_component= finishing.Heat_Treater;
   finishing.component.State= "Finished";
finishing.component.Process_Stage= "Finished";
     if(finishing.completedDate==5){
    finishing.component.actualDelivery.setDate(finishing.component.actualDelivery.getDate() + 5);
     }
     
    else{
       finishing.component.actualDelivery.setDate(finishing.component.actualDelivery.getDate() + finishing.completedData);
      document.write("Delayed in finishing process");
      
    }
     
     }
     return getAssetRegistry('org.diemanufacturing.Component')
    .then (function (assetRegistry) {
    return assetRegistry.update(finishing.component);
    })
   
 }


/**
* Sample transaction
* @param {org.diemanufacturing.final_inspection} final_inspection
* @transaction
*/

 async function final_inspection(final_inspection) {

   if( final_inspection.component.State= "finished")
   {
   //vaccum_treatment.component.owner_component= vaccum_treatment.Heat_Treater;
   final_inspection.component.State= "Inspected";
final_inspection.component.Process_Stage= "Inspected";
     if(final_inspection.completedDate==3){
final_inspection.component.actualDelivery.setDate(final_inspection.component.actualDelivery.getDate() + 3);
   }
   else{
final_inspection.component.actualDelivery.setDate(final_inspection.component.actualDelivery.getDate() + final_inspection.completedDate);
document.write("Delayed in the process of inspection");  
   }
     
   //  throw new window.alert("Component is ready to use");
var actual=final_inspection.component.actualDelivery.getDate();
 var expected=final_inspection.component.expDelivery.getDate();
   if(actual==expected){
     document.write("Component is ready to use and it is delivered on time");
   }
     else{
      document.write("Component is ready to use and but it is delayed"); 
     }
   }
   
     return getAssetRegistry('org.diemanufacturing.Component')
    .then (function (assetRegistry) {
    return assetRegistry.update(final_inspection.component);
    })
   
 }


