const factor=2
const height=300
const therm_top = 0
const therm_left = 0
const head_space= 10
const increment=100
let max = 0
let degree_size = .5


function set_temp(degrees){
    
    if(degrees > max){
        // rescale the thermometer
        while(degrees > max){
            max+=increment
        }
        remove_numbers()
        add_numbers(0,(max/increment)+1)
        add_goal(911)
    }

    const tube=tag("tube")
    const bulb_top=tag("bulb").style.top.split("px")[0]
    const the_top=get_mercury(degrees)
    tube.style.top = the_top
    tube.style.height = bulb_top-the_top+10*factor

}

function get_mercury(degrees){
    const tube=tag("tube")
    const percent = degrees/max
    const offset=18*factor
    const tube_top = parseInt(tag("tube-border").style.top.split("px")[0])
    //let bar_height = (((height-26 - (head_space*factor*.1))) * factor * (percent))+(18*factor )
    //console.log("mercury degree_size",degree_size, "degrees",degrees)
    const bar_height = degrees*degree_size+offset
    return tube_top + ((height*factor)-bar_height)

}

function start_me_up(){    
    //tag("tube").style.backgroundColor="green"
    scale_thermometer()
    add_numbers(0,11)
    set_temp(0)
    add_goal(911)
    const url="https://script.google.com/macros/s/AKfycbxqFnBNDhjQ0mwonAdYa8CPO_41ljdrs1xGl1xwF60fAOidtJYtE2IAEI-wzbUiWFVu/exec"
    fetch(url)
    .then((response) => response.json())
    .then((data)=>{
        //console.log("data",data.hours)   
        tag("hours-recorded").innerHTML=Math.round(100*data.hours)/100
        set_temp(data.hours)     
    })
    
}
function scale_thermometer(){
    const bulb=tag("bulb")
    bulb.style.height = 40*factor
    bulb.style.width = 40*factor
    bulb.style.top = height*factor+therm_top
    bulb.style.left = 2*factor+therm_left

    const tube=tag("tube")
    tube.style.width = 20*factor
    tube.style.left = 12*factor+therm_left
    tube.style.height = 10*factor
    tube.style.top = (height-(height/200))*factor+therm_top
    //console.log((height-(height/200))*factor+therm_top)
    
    const bulb_border=tag("bulb-border")
    bulb_border.style.height = 44*factor
    bulb_border.style.width = 44*factor
    bulb_border.style.top = (height-2)*factor+therm_top
    bulb_border.style.left = 0+therm_left
    
    const tube_border=tag("tube-border")
    tube_border.style.height = height*factor
    tube_border.style.width = 20*factor
    tube_border.style.top = 16*factor+therm_top
    tube_border.style.left = 10*factor+therm_left
    tube_border.style.borderWidth = 2*factor
    tube_border.style.borderRadius = (20*factor) + "px"
    

}
function add_numbers(first=0, count=11){
    max=first+increment*(count-1)
    const tube_top=parseInt(tag("tube-border").style.top.split("px")[0]) + head_space * factor
    degree_size = .01

    // figure out the degree size
    while(get_mercury(first+increment*(count-1))> tube_top + head_space * factor){
         degree_size+=.01
       //console.log("degree_size",degree_size)
     }

    let clearance=  parseInt(tag("bulb").style.top.split("px")[0])   
    for(let i=0;i<count;i++){
        if(clearance > get_mercury(first+(i*increment)) - 7.7 * factor){
          clearance = add_number(first+(i*increment))
        }
    }
}

function remove_numbers(){
    const nums=document.getElementsByClassName("number")
    for(let i=nums.length-1;i>=0;i--){
        nums[i].remove()
    }
}

function add_number(degrees){
    const percent = degrees/max
  //console.log ("degrees",degrees)
  //console.log ("percent",percent)
    const new_div = document.createElement("div");
    const text=document.createTextNode("-" + degrees)
    new_div.className = "number"
    new_div.style.fontSize = (12*factor)+"px"
    new_div.appendChild(text);
    new_div.style.left=10*factor+therm_left + 23*factor 
    const mercury = get_mercury(degrees)
  //console.log("mercury",mercury)
    const div_top=mercury - 7.7*factor
    new_div.style.top= div_top
    tag("therm").prepend(new_div)
    return div_top-new_div.offsetHeight 
}


function add_goal(degrees){
    const percent = degrees/max
    const new_div = document.createElement("div");
    const text=document.createTextNode(degrees + "-")
    new_div.className = "number"
    new_div.style.fontSize = (12*factor)+"px"
    new_div.appendChild(text);
    new_div.style.left=therm_left -20*factor
    new_div.style.width=31*factor
    new_div.style.textAlign="right"
    // new_div.style.borderWidth="2px"
    // new_div.style.borderColor="black"
    // new_div.style.borderStyle="solid"
    new_div.style.top=get_mercury(degrees) - 7.7*factor
    tag("therm").prepend(new_div)
}






function tag(id){
    return document.getElementById(id)
}


function submit_form(){
    
    let valid=true
    // data validation
    if(tag("date").value){
        tag("v-date").innerHTML=""
    }else{    
        tag("v-date").innerHTML="Date is required"
        valid=false;
    }
    if(tag("desc").value){
        tag("v-desc").innerHTML=""
    }else{    
        tag("v-desc").innerHTML='Description of service is required. <span style="color:black">For example: "Cleaned up litter in park".</span>'
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
    if(tag("hours").value){
        tag("v-hours").innerHTML=""
    }else{    
      tag("v-hours").innerHTML='Total Hours is required.<span style="color:black"> For example, if three people each worked on a project that lasted two hours, enter "6" here.</span>'
      valid=false;
    }

    if(tag("email").value && !ValidateEmail(tag("email").value)){
        tag("v-email").innerHTML='The email address entered is not valid.'
        valid=false;
    }else if(tag("photos").checked && !tag("email").value){
            tag("v-email").innerHTML='Email is reqired when you indicate that you have photos or video to share.'
            valid=false;
    }else{
        tag("v-email").innerHTML=''    
    }

  //console.log("phemailtos", tag("email").value)

    if(!valid){return}

    tag("thanx").innerHTML='Submitting...'

    const payload=[]
    
    payload.push("entry.1728423210=")
    payload.push(tag("date").value)
    payload.push("&entry.1238949363=")
    payload.push(encodeURIComponent(tag("desc").value))
    payload.push("&entry.780948230=")
    payload.push(tag("peeps").value)
    payload.push("&entry.495148900=")
    payload.push(tag("hours").value)
    payload.push("&entry.256341693=")

    if(tag("photos").checked){
        payload.push("Yes")
    }else{
        payload.push("No")
    }
    
    payload.push("&entry.339495007=")
    payload.push(encodeURIComponent(tag("name").value))
    payload.push("&entry.658442213=")
    payload.push(encodeURIComponent(tag("email").value))
    


    

    const options = { 
        method: "POST", 
        mode: "no-cors",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
        body: payload.join(""),
    }
    fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLScPYoSN0oi0cswbTsCKJ72TDx3YvDSed8beigsx__x79D6H-g/formResponse", options)
    .then((response) => response.text())
    .then((data)=>{
      //console.log("success",data)
        tag("thanx").innerHTML='Thank you for serving. Your hours have been recorded.'

        let hrs=parseFloat(tag("hours-recorded").innerHTML)
        hrs+=parseFloat(tag("hours").value)
        tag("hours-recorded").innerHTML=Math.round(100*hrs)/100
        set_temp(hrs)

        tag("date").value=""
        tag("desc").value=""
        tag("peeps").value=""
        tag("hours").value=""
        tag("photos").checked=false  
    });
    //return false
}

function tot_hours(){
    const peeps = tag("peeps").value
    const hours = tag("hours").value
    if(!peeps){tag("v-hours").innerHTML="";return}
    if(!hours){tag("v-hours").innerHTML="";return}
    if(isNaN(peeps)){tag("v-hours").innerHTML="";return}
    if(isNaN(hours)){tag("v-hours").innerHTML="";return}
    
    tag("v-hours").innerHTML='<span style="color:grey">Each person served an average of <span style="color:black">' + Math.round(100*hours/peeps)/100+'</span> hours</span>'
    
  //console.log()

}

function ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}