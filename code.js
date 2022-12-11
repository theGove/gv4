const settings={
    default:{
        factor:1.5,
        height: 300,
        therm_top: 0,
        therm_left: 20,
        head_space: 10,
        lower_temp:0,
        tick_count:14, 
        goal_temp:300,
        increment:25,
        container_width: 200,
        width: 120,
        backgroundColor:"white",    
        html:"Text goes here",
    },
    story:{
        html:"Stories",
        activityLabel:"# of stories recorded",
    },
    baptism:{
        html:"Baptism",
        activityLabel:"# of Baptisms completed",
    },
    endowment:{
        html:"Endowments",
        activityLabel:"# of endowments completed",
    }
}

function start_me_up(){    
    //tag("tube").style.backgroundColor="green"
    for(const key of Object.keys(settings)){
        if(key!=="default"){
            build_therm(key,"body")
        }
    }
    
    const url="https://script.google.com/macros/s/AKfycbxzAAEXK35o9GvfhvgDxHoCVc9u4MMdv8j43jmBJINtEWqEt0yVrujdo8dukb7X-5sp/exec"
    fetch(url)
    .then((resp) => resp.json())
    .then((response)=>{
        console.log("data",response.data)  
        for(const row of response.data){
            console.log(row)
            if(settings[row[0]]){
                // we have a recording of a named thermometer
                set_temp(row[0],row[1])  
            }
        } 
        //tag("hours-recorded").innerHTML=Math.round(100*data.hours)/100
        //set_temp("therm",data.hours)     
    })
    
}

function submit_form(){
    
    let valid=true
    // data validation
    if(tag("activity").value!=="label"){
        tag("v-activity").innerHTML=""
    }else{    
        tag("v-activity").innerHTML="Activity is required"
        valid=false;
    }


    if(tag("date").value){
        tag("v-date").innerHTML=""
    }else{    
        tag("v-date").innerHTML="Date is required"
        valid=false;
    }

    if(tag("peeps").value){
          tag("v-peeps").innerHTML=""
        //console.log("at peeps")
    }else{    
      //console.log("not at peeps")
        tag("v-peeps").innerHTML='Number of People is required.<span style="color:black"></span>'
        valid=false;
    }
    if(tag("number").value){
        tag("v-number").innerHTML=""
    }else{    
      tag("v-number").innerHTML='Total number is required.<span style="color:black"> For example, if three people worked together to complete 20 baptisms, enter 20 here.</span>'
      valid=false;
    }


  //console.log("phemailtos", tag("email").value)

    if(!valid){return}

    tag("thanx").innerHTML='Submitting...'

    const payload=[]
    
    payload.push("entry.279552853=")
    payload.push(tag("number").value)
    payload.push("&entry.849657465=")
    payload.push(encodeURIComponent(tag("activity").value))
    payload.push("&entry.802116300=")
    payload.push(tag("date").value)
    payload.push("&entry.2040081148=")
    payload.push(encodeURIComponent(tag("desc").value))
    payload.push("&entry.1089798717=")
    payload.push(tag("peeps").value)
    payload.push("&entry.888506024=")
    payload.push(encodeURIComponent(tag("name").value))
    

    console.log("payload",payload,payload.join(""))
    

    const options = { 
        method: "POST", 
        mode: "no-cors",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
        body: payload.join(""),
    }
    fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLScqG9BdHNAsVsveOainGGkFGvvMvxcSk9ptijMpjBZzL7xEOw/formResponse", options)
    .then((response) => response.text())
    .then((data)=>{
      //console.log("success",data)
        tag("thanx").innerHTML='Thank you for serving. Your work has been recorded.'

        // let hrs=parseFloat(tag("hours-recorded").innerHTML)
        // hrs+=parseFloat(tag("hours").value)
        // tag("hours-recorded").innerHTML=Math.round(100*hrs)/100
        set_temp( tag("activity").value, settings[tag("activity").value].degrees + parseInt(tag("number").value))

        //tag("date").value=""
        tag("desc").value=""
        tag("peeps").value=""
        tag("number").value=""
        
    });
    //return false
}

function set_activity(object){
    console.log(object.value)
    tag("activity-label").innerHTML = settings[object.value].activityLabel
    if(object.options[0].value==="label"){
        object.remove(0)
    }
}

function tag(id){
    return document.getElementById(id)
}

