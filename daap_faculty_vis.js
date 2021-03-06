'use strict'
let color_count = 0
const colorscale = d3.schemeSet2
function OneDatum(selected=false, values=[], search_list=false, name="", datum_name=''){
  let interest_names = []
  if(values[0] == 'Urban Systems'){
    values.forEach(function(d){
      interest_names.push(d.toUpperCase())
    })
  }
  color_count ++;

  let values_dict = {}
  values.forEach(function(d){
    values_dict[d] = 1
  })
  return {
    "selected" : selected,
    "values" : values,
    "search_list" : search_list,
    "values_dict" : values_dict,
    "name" : name,
    "datum_name" : datum_name,
    "interest_names" : interest_names,
    "color" : colorscale[color_count]
  }
}


async function wrapper(){

	let height = window.innerHeight;
	let width = window.innerWidth;

d3.select("#faculty-table").style("height", height)

  console.log(height)
  
  let svg_width = width * .66
  let svg_height = 400 
  svg_width = 400 
  console.log(svg_width)
  console.log(svg_height)
	let data = await d3.csv('cleaned_DAAP_faculty.csv')

  let weight_data = await d3.json('extra_dicts.json')

  console.log(weight_data)

  const data_holder = {
  "interests" : OneDatum(false, ['Urban Systems', 'Digital Culture', 'Sustainable Living', 'Creative Entrepreneurship', 'Health and Wellbeing'], "interests", "Official Interests", ""),
  "interests_cleaned" : OneDatum(false, interests_cleaned_vals, true , "Written Interests", "interests_cleaned"),
  "projects" : OneDatum(false, projects_cleaned_vals, true, "Project Descriptions", "projects_cleaned"),
  "skills" : OneDatum(false, skills_cleaned_vals, true, "Skills", "skills_cleaned"),
  "bios" : OneDatum(false, bios_cleaned_vals, true, "Bios", "bios_cleaned"),
  "departments" : OneDatum(false, ['ART', 'PLANNING', 'DESIGN', 'ARCHITECTURE'], false, "Departments", "School")
}


data.forEach(function(d){
  d.bios_cleaned = JSON.parse(d.bios_cleaned.replaceAll("'", '"'))
  d.skills_cleaned = JSON.parse(d.skills_cleaned.replaceAll("'", '"'))
  d.projects_cleaned = JSON.parse(d.projects_cleaned.replaceAll("'", '"'))
  d.interests_cleaned = JSON.parse(d.interests_cleaned.replaceAll("'", '"'))
  d['id'] = d['']
  d['type'] = 'faculty'
})

let buttons_order = []

let value_buttons = d3.select("#buttons-div").selectAll(".button")
    .data(Object.keys(data_holder))
    .join("button")
    .attr("class", "btn mr-2 mb-2")
    .attr("id", function(d){
      return d
    })
    .on("click", function(e){
      let field = d3.select(this).attr("id")
      if (data_holder[field].selected){
        if (buttons_order[0] != field){
          alert("please deselect buttons in the reverse order you selected them in")
          return
        }
        buttons_order.shift()
        d3.select(this).style("background-color", "#d3d3d3")
      }
      else{
        buttons_order.unshift(field)
        d3.select(this).style("background-color", data_holder[field].color)
      }
      updateData(field, !data_holder[field].selected)
      simulation.nodes(nodes);
      simulation.force("link").links(links);
      updateNodes()
      updateLinks()
      simulation.alpha(1).restart();
      data_holder[field].selected = !data_holder[field].selected
    })

    .classed("unselected", function(d){
      return !data_holder[d].selected
    })
    .text(function(d){
      return data_holder[d].name
    })

  console.log(data_holder)
  console.log(data)
	let vis_svg = d3.select("div#vis")
	   .append("div")
	   
	   .classed("svg-container", true) 
	   .append("svg")
	   .attr("preserveAspectRatio", "xMinYMin meet")
	   .attr("viewBox", "0 0 " + svg_width + " " + svg_height)
	   .classed("svg-content-responsive", true)





  let tbody = d3.select('#fac-body-table')


  console.log(data)
  let trows = tbody.selectAll('tr').data(data).join("tr").attr("class", function(d){
    let class_string = ""
    Object.keys(data_holder).forEach(function(k){
      if(k == 'interests'){
       data_holder[k].values.forEach(function(inter){
        var class_name = inter.replaceAll(" ", "_").toLowerCase();
        if (d[inter].length != 1){
          class_string = class_string + " " +class_name
        }
       })
      }
      if (typeof(d[data_holder[k].datum_name]) == 'string'){
        if (isNaN(parseInt(d[data_holder[k].datum_name]))){
          class_string = class_string + " " + d[data_holder[k].datum_name].toLowerCase()
        }
        else{
          class_string = class_string + " i_" + d[data_holder[k].datum_name]
        }
        
      }
      else {
        let filtered = d[data_holder[k].datum_name].filter(function(n){
          if (isNaN(parseInt(n))){
            if(n == 'media'){
              return false
            }
            return true
          }
          return false
        })

        class_string = class_string + " " + filtered.join(" ")
      }
    })

    return "table_row" + " " + class_string
    //return "table_row"
  })
  .style("background-color", "")

  let tcols = trows.selectAll("td").data(function(r){
    let rmap =  [r['Faculty Name'] , r['Interests (5 to 10)'], r['Projects'], r['Skills']]
    return rmap
  })
  .join("td")
  //.attr("class", "td").style("width", "25%")
  .text(function(d){
      return d
    })
	d3.select("#loading").classed("hidden", true)
	d3.selectAll(".load-unhide").classed("hidden", false)

  const t = vis_svg.transition()
        .duration(750);

  
	let nodes = data//.concat(interest_names)
  let links = [];

  var thing = vis_svg.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .style("fill","white")
                    .attr('height', svg_height)
                    .attr("width", svg_width)
                    .on("click", function(evt){
                      if (clickedNode != undefined){
                         clickedNode.select("circle").attr("stroke-width", .5)
                          d3.selectAll(".table_row").classed("hidden", false).style("background-color", "white")
                          //d3.selectAll("." + clickedNode.attr("id")).style("background-color", "white").classed("hidden", false)
                          d3.selectAll(".c_" + clickedNode.attr("id")).style("stroke-opacity", function(d){
                              return .3
                          })
                          clickedNode = undefined
                      }
                     
                    })

  var link = vis_svg.append("g").attr("class", "link_svg").selectAll("line")
  
  var node = vis_svg.append("g").selectAll(".g");

	const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(function(d){
      	return d.id
      }).distance(function(d){
        return .1
      }))
      .force("charge", d3.forceManyBody())
      .force("collision", d3.forceCollide(5))
      .force("x", d3.forceX(svg_width / 2))
      .force("y", d3.forceY(svg_height / 2));
    
    updateNodes()
    updateLinks()

  let sizeScale = d3.scaleLinear().domain([1, 49]).range([3, 20])
  function updateData(field, add){
    //adding nodes and links
    if (add){
      //special case for wierdly formatted interests values
      if(data_holder[field].search_list == 'interests'){
         data_holder[field].interest_names.forEach(function(d){
          nodes.push({
            "id" : d,
            "type" : field,
            "weight" : 5
          })
        });
      
        nodes.forEach(function(n){
          if(n.type == 'faculty'){
            data_holder[field].values.forEach(function(i){
              if(n[i] != "-"){
                links.push(
                    {
                      "source" : n[""],
                      "target" : n[i]
                    }
                  )
              }
            })
          }
        })
      }
      else if(data_holder[field].search_list == false){
        data_holder[field].values.forEach(function(d){
          nodes.push({
            "id" : d,
            "type" : field,
            "weight" : 5
          })
        })
        nodes.forEach(function(n){
          if(n[data_holder[field].datum_name] != undefined){
            links.push({
              "source" : n[""],
              "target" : n.School
            })
          }
        })
      }
      else if(data_holder[field].search_list == true){
        data_holder[field].values.forEach(function(d){
          nodes.push({
            "id" : d,
            "type" : field,
            "weight" : sizeScale(weight_data[field][d])
          })
        })
        nodes.forEach(function(n){
          if(n[data_holder[field].datum_name] != undefined){
            n[data_holder[field].datum_name].forEach(function(v){
              if (data_holder[field].values_dict[v] != undefined){
                links.push({
                  "source" : n[""],
                  "target" : v
                })
              } 
              
            })
          }
        })
      }

    }
    //removing nodes and links
    else{
      nodes = nodes.filter(function(d){
        if (d.type == field){
          return false
        }
        return true
      })

      links = links.filter(function(d){
        if (d.source.type ==  field|| d.target.type == field){
          return false
        }
        return true
      })
    }
  }//updateData

  function updateLinks(){
    link = link.data(links)
        .join("line")
        .attr("stroke", function(d){
          return data_holder[d.target.type].color
          
        })
        .attr("class", function(d){
          return "c_" + d.source.id + " c_" + d.target.id;
        })
        .attr("stroke-opacity", .2)
        .attr("stroke-width",function(d){
          return 2
        })
  }//updateLinks


  let clickedNode = undefined;

  function updateNodes(){
      node = node
      .data(nodes)
      .join(function(enter){ 
        let enter_d = enter.append("g")
        .attr("class", function(d){
          return "node_g"; 
        })
        .attr("id", function(d){
          return d.id
        })
        .on("mouseover", function(e){
          let thenode = d3.select(this)
          thenode.select("circle").attr("stroke", 'red')
          d3.selectAll(".c_" + thenode.attr("id")).classed("highlightlink", true)
  
        })
        .on("mouseout", function(e){
          let thenode = d3.select(this)
          thenode.select("circle").attr("stroke", 'black')
          d3.selectAll(".c_" + thenode.attr("id")).classed("highlightlink", false)
        })
        .on("click", function(e){
          let thenode = d3.select(this)
          console.log(thenode)
          if (clickedNode != undefined){
            clickedNode.select("circle").attr("stroke-width", .5)
            //d3.selectAll("." + thenode.attr("id")).style("background-color", thenode.select("circle").attr("fill")).classed("hidden", false)
            d3.selectAll(".c_" + clickedNode.attr("id")).style("stroke-opacity", function(d){
              return .2
            })
          }
          
          thenode.select("circle").attr("stroke-width", 3)
          d3.selectAll(".table_row").classed("hidden", true)
          if(isNaN(parseInt(thenode.attr("id")))){
            let trow_class = thenode.attr("id").replaceAll(" ", "_").toLowerCase()
            d3.selectAll("." + trow_class).style("background-color", thenode.select("circle").attr("fill")).classed("hidden", false)
            d3.selectAll(".c_" + thenode.attr("id")).style("stroke-opacity", function(d){
              return 1
            })
          }
          else {
            d3.select(".i_" + thenode.attr("id")).classed("hidden", false)
          }
          clickedNode = thenode
        })
        .call(drag(simulation))
        enter_d.append("circle")
        .attr("r", function(d){
          if(d.type == 'faculty'){
            return 3
          }
          else {
            return d.weight
          }
        })
        .attr("fill", function(d){
          if (d.type == 'faculty'){
            return 'grey'
          }
          return data_holder[d.type].color
        })

        .attr("stroke", 'black')
        .attr("stroke-width", .5)



      enter_d.append("text")
        .attr("x", 0)
        //.attr("y", 0)
        .text(function(d){
          if (d.type != 'faculty'){ return d.id }
        
       })

      enter_d.append("title")
        .text(function(d){
          return d['Faculty Name']
        })
      return enter_d;
      },//enter
      function(update){
       return update
      }
    );
  }//updateNodes

    simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"
      })
  });

  invalidation.then(() => simulation.stop());

  function drag(simulation){
    
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event,d) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event,d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }//simulation


  function resize_table() {
   height = window.innerHeight;
   width = window.innerWidth;
   d3.select("#faculty-table").style("height", height)

}

window.onresize = resize_table;
}//wrapper

wrapper()