let max = 0
let degree_size = .5

function build_therm(thermometer_name,container_id){
    const setting=get_settings(thermometer_name)
    console.log("buuilding", thermometer_name, setting)
    const container=tag(container_id)
    container.innerHTML+=`
    <div class="therm-container" style="width:${setting.container_width};background-color:${setting.backgroundColor}">
    <div class="therm" id="${thermometer_name}-therm" style="margin-left: ${setting.left_offset}px;height:${setting.container_height}px; width:${setting.width}px">  
    <div class = "tube-border" id="${thermometer_name}-tube-border"></div>            
    <div class = "bulb-border" id="${thermometer_name}-bulb-border"></div>
    <div class = "tube" id="${thermometer_name}-tube"></div>            
    <div class = "bulb" id="${thermometer_name}-bulb"></div>
    </div>
    <div class = "therm-text" id="${thermometer_name}-text">${setting.html}</div>            
    </div>
    `
    scale_thermometer(thermometer_name)
    add_numbers(thermometer_name,setting.lower_temp,setting.tick_count)
    set_temp(thermometer_name,setting.lower_temp)
    add_goal(thermometer_name,setting.goal_temp)

}



function get_settings(thermometer_name){
    const setting=JSON.parse(JSON.stringify(settings.default))
    console.log("setting",JSON.stringify(setting,null,2))
    const overrides=settings[thermometer_name]
    console.log("overrides",thermometer_name,overrides)
    if(overrides!==undefined){
        console.log("found overrides")
        for(const [key,val] of Object.entries(overrides)){
            setting[key]=val
        }
    }
    console.log("setting",setting)
    setting.left_offset= 5 * setting.factor
    setting.width= 90 * setting.factor
    setting.container_height=(setting.height+60) * setting.factor
    return setting
}

function set_temp(thermometer_name,degrees){
    const setting=get_settings(thermometer_name)
    settings[thermometer_name].degrees=parseInt(degrees)
    if(degrees > max){
        // rescale the thermometer
        while(degrees > max){
            max+=setting.increment
        }
        remove_numbers(thermometer_name)
        add_numbers(thermometer_name,0,(max/setting.increment)+1)
        add_goal(thermometer_name,911)
    }

    const tube=tag(thermometer_name + "-tube")
    const bulb_top=tag(thermometer_name + "-bulb").style.top.split("px")[0]
    const the_top=get_mercury(thermometer_name,degrees)
    tube.style.top = the_top
    tube.style.height = bulb_top-the_top+10*setting.factor

}

function get_mercury(thermometer_name,degrees){
    const setting=get_settings(thermometer_name)
    console.log("getting mercury", thermometer_name)
    const tube=tag(thermometer_name + "-tube")
    const percent = degrees/max
    const offset=18*setting.factor
    const tube_top = parseInt(tag(thermometer_name + "-tube-border").style.top.split("px")[0])
    //let bar_height = (((height-26 - (setting.head_space*setting.factor*.1))) * setting.factor * (percent))+(18*setting.factor )
    //console.log("mercury degree_size",degree_size, "degrees",degrees)
    const bar_height = degrees*degree_size+offset
    return tube_top + ((setting.height*setting.factor)-bar_height)

}


function scale_thermometer(thermometer_name){
    console.log("scaling", thermometer_name, settings, settings[thermometer_name])
    const setting=get_settings(thermometer_name)
    console.log("setting, thermometer_name",setting, thermometer_name)
    console.log("getting",thermometer_name + "-bulb")
    const bulb=tag(thermometer_name + "-bulb")
    bulb.style.height = 40*setting.factor
    bulb.style.width = 40*setting.factor
    bulb.style.top = setting.height*setting.factor+setting.therm_top
    bulb.style.left = 2*setting.factor+setting.therm_left

    const tube=tag(thermometer_name + "-tube")
    tube.style.width = 20*setting.factor
    tube.style.left = 12*setting.factor+setting.therm_left
    tube.style.height = 10*setting.factor
    tube.style.top = (setting.height-(setting.height/200))*setting.factor+setting.therm_top
    //console.log((height-(height/200))*setting.factor+setting.therm_top)
    
    const bulb_border=tag(thermometer_name + "-bulb-border")
    bulb_border.style.height = 44*setting.factor
    bulb_border.style.width = 44*setting.factor
    bulb_border.style.top = (setting.height-2)*setting.factor+setting.therm_top
    bulb_border.style.left = 0+setting.therm_left
    
    const tube_border=tag(thermometer_name + "-tube-border")
    tube_border.style.height = setting.height*setting.factor
    tube_border.style.width = 20*setting.factor
    tube_border.style.top = 16*setting.factor+setting.therm_top
    tube_border.style.left = 10*setting.factor+setting.therm_left
    tube_border.style.borderWidth = 2*setting.factor
    tube_border.style.borderRadius = (20*setting.factor) + "px"
    

}
function add_numbers(thermometer_name,first=0, count=11){
    const setting=get_settings(thermometer_name)
    max=first+setting.increment*(count-1)
    const tube_top=parseInt(tag(thermometer_name + "-tube-border").style.top.split("px")[0]) + setting.head_space * setting.factor
    degree_size = .01

    // figure out the degree size
    while(get_mercury(thermometer_name,first+setting.increment*(count-1))> tube_top + setting.head_space * setting.factor){
         degree_size+=.01
       //console.log("degree_size",degree_size)
     }

    let clearance=  parseInt(tag(thermometer_name + "-bulb").style.top.split("px")[0])   
    for(let i=0;i<count;i++){
        if(clearance > get_mercury(thermometer_name,first+(i*setting.increment)) - 7.7 * setting.factor){
          clearance = add_number(thermometer_name,first+(i*setting.increment))
        }
    }
}

function remove_numbers(thermometer_name,){
    const nums=document.getElementsByClassName("number")
    for(let i=nums.length-1;i>=0;i--){
        nums[i].remove()
    }
}

function add_number(thermometer_name,degrees){
    const setting=get_settings(thermometer_name)
    const percent = degrees/max
  //console.log ("degrees",degrees)
  //console.log ("percent",percent)
    const new_div = document.createElement("div");
    const text=document.createTextNode("-" + degrees)
    new_div.className = "number"
    new_div.style.fontSize = (12*setting.factor)+"px"
    new_div.appendChild(text);
    new_div.style.left=10*setting.factor+setting.therm_left + 23*setting.factor 
    const mercury = get_mercury(thermometer_name,degrees)
  //console.log("mercury",mercury)
    const div_top=mercury - 7.7*setting.factor
    new_div.style.top= div_top
    tag(thermometer_name + "-therm").prepend(new_div)
    return div_top-new_div.offsetHeight 
}


function add_goal(thermometer_name,degrees){
    const setting=get_settings(thermometer_name)
    const percent = degrees/max
    const new_div = document.createElement("div");
    const text=document.createTextNode(degrees + "-")
    new_div.className = "number"
    new_div.style.fontSize = (12*setting.factor)+"px"
    new_div.appendChild(text);
    new_div.style.left=setting.therm_left -20*setting.factor
    new_div.style.width=31*setting.factor
    new_div.style.textAlign="right"
    // new_div.style.borderWidth="2px"
    // new_div.style.borderColor="black"
    // new_div.style.borderStyle="solid"
    new_div.style.top=get_mercury(thermometer_name,degrees) - 7.7*setting.factor
    tag(thermometer_name + "-therm").prepend(new_div)
}
