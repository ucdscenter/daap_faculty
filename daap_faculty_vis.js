'use strict'

function OneDatum(selected=false, values=[], search_list=false, name="", datum_name=''){
  let interest_names = []
  if(values[0] == 'Urban Systems'){
    values.forEach(function(d){
      interest_names.push(d.toUpperCase())
    })
  }

  return {
    "selected" : selected,
    "values" : values,
    "search_list" : search_list,
    "name" : name,
    "datum_name" : datum_name,
    "interest_names" : interest_names
  }
}


async function wrapper(){
	console.log("hi there")

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



  const data_holder = {
  "interests" : OneDatum(false, ['Urban Systems', 'Digital Culture', 'Sustainable Living', 'Creative Entrepreneurship', 'Health and Wellbeing'], "interests", "Official Interests", ""),
  //"skills" : {},
  //"projects": {},
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
})

let value_buttons = d3.select("#buttons-div").selectAll(".button")
    .data(Object.keys(data_holder))
    .join("button")
    .attr("class", "btn btn-danger mr-2")
    .attr("id", function(d){
      return d
    })
    .on("click", function(e){
      let field = d3.select(this).attr("id")
      updateData(field, !data_holder[field].selected)
      simulation.nodes(nodes);
      simulation.force("link").links(links);
      //console.log(links)
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


 
	data.forEach(function(d){
		d['id'] = d['Faculty Name'];
    d['type'] = 'faculty'
	})


  let tbody = d3.select('#fac-body-table')



  let trows = tbody.selectAll('tr').data(data).join("tr").attr("class", function(d){
    return "table_row"
  })

  let tcols = trows.selectAll("td").data(function(r){
    let rmap =  [r['Faculty Name'] + "\n" + r['Faculty Credentials and Contact'], r['Interests (5 to 10)'], r['Projects'], r['Skills']]
    return rmap
  })
    .join("td").attr("class", "td").text(function(d){
      return d
    })
	d3.select("#loading").classed("hidden", true)
	d3.selectAll(".load-unhide").classed("hidden", false)

  const t = vis_svg.transition()
        .duration(750);

  
	let nodes = data//.concat(interest_names)
  let links = [];
  var link = vis_svg.append("g").attr("class", "link_svg").selectAll("line")
  
  var node = vis_svg.append("g").selectAll(".g");

	const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(function(d){
      	return d.id
      }))
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX(svg_width / 2))
      .force("y", d3.forceY(svg_height / 2));
    
    updateNodes()
    updateLinks()

  function updateData(field, add){
    //adding nodes and links
    if (add){
      //special case for wierdly formatted interests values
      if(data_holder[field].search_list == 'interests'){
         data_holder[field].interest_names.forEach(function(d){
          nodes.push({
            "id" : d,
            "type" : field
          })
        });
      
        nodes.forEach(function(n){
          if(n.type == 'faculty'){
            data_holder[field].values.forEach(function(i){
              if(n[i] != "-"){
                links.push(
                    {
                      "source" : n.id,
                      "target" : n[i]
                    }
                  )
              }
            })
          }
        })
         console.log(links)
      }
      else if(data_holder[field].search_list == false){
        data_holder[field].values.forEach(function(d){
          nodes.push({
            "id" : d,
            "type" : field
          })
        })
        nodes.forEach(function(n){
          if(n[data_holder[field].datum_name] != undefined){
            links.push({
              "source" : n.id,
              "target" : n.School
            })
          }
        })
      }
      else if(data_holder[field].search_list == true){
        data_holder[field].values.forEach(function(d){
          nodes.push({
            "id" : d,
            "type" : field
          })
        })
        console.log(nodes)
        nodes.forEach(function(n){
          if(n[data_holder[field].datum_name] != undefined){
            n[data_holder[field].datum_name].forEach(function(v){
              links.push({
                "source" : n.id,
                "target" : v
              })
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
        .attr("stroke", "#d3d3d3")
        .attr("stroke-opacity", .5)
        .attr("stroke-width",function(d){
          return 2
        })
  }//updateLinks



  
  function updateNodes(){
      node = node
      .data(nodes)
      .join(function(enter){ 
        let enter_d = enter.append("g")
        .attr("class", "node_g")
        .call(drag(simulation))
        enter_d.append("circle")
        .attr("r", function(d){
          if(d.type == 'faculty'){
            return 3
          }
          else {
            return 5
          }
        })
        .attr("fill", function(d){
          if (d.type == 'new'){
            return 'green'
          }
          if (d.type != 'faculty'){
            return 'red'
          }
        })



      enter_d.append("text")
        .attr("x", 0)
        //.attr("y", 0)
        .text(function(d){
          if (d.type != 'faculty'){ return d.id }
        
       })

      enter_d.append("title")
        .text(d => d.id)
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

}//wrapper

wrapper()