var heightWindow, widthWindow;


function receivedText(e){

	var heightWindow = $(window).innerHeight() - 120,
		widthWindow = $(".container-expo").innerWidth() - 60;

//min height for testing
	if(heightWindow <= 600){
		heightWindow = 600;
	}


	$('#container-graph').attr('width', widthWindow).attr('height', heightWindow).css("height", heightWindow);

//parse json D3.js
	var fileName = e.target.result;




//-----------------filtering and coordinates-------------------

	//change grid for left sidebar
	$("#left-sidebar").removeClass("hidden");
	$("#container-expo").removeClass("col-md-10").addClass("col-md-8");
	//show sidebar
	$("#sidebar-data").removeClass("hidden");
	$(".upload-wrapper").addClass("hidden");
	$(".slogan").addClass("hidden");

	//default cart:
	//trendsRiskMap(graph);
	//riskInterconMap(graph);
	riskInterconMap(JSON.parse(fileName));

	//});//End json d3.js

}//end receivedText



//call r-i map
$("#intercon-button").on("click",function(){
	$("#container-graph").html("");

	function receivedText(){
		$("#container-graph").attr("width", widthWindow).attr("height", heightWindow).css("height", heightWindow);



		//parse json D3.js
		var fileName = fr.result;

		riskInterconMap(JSON.parse(fileName));


	}//end receivedText
	receivedText();
});

//call t-r map
$("#trends-button").on("click",function(){
	$('#container-graph').html('');


	function receivedText(){
		$('#container-graph').attr('width', widthWindow).attr('height', heightWindow).css("height", heightWindow);




		//parse json D3.js
		var fileName = fr.result;
			trendsRiskMap(JSON.parse(fileName));

	}//end receivedText
	receivedText();
});

//call landscape map
$("#landscape-map").on("click",function(){
	$('#container-graph').html('');

	function receivedText(){
		$('#container-graph').attr('width', widthWindow).attr('height', heightWindow).css("height", heightWindow);

		//parse json D3.js
		var fileName = fr.result;

		landscapeMap(JSON.parse(fileName));

		//});//End json d3.js

	}//end receivedText
	receivedText();
});

var input = document.getElementById('upload-input');
//rules to upload file
function handleFileSelect()
{
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else {
        fileAppStare();
    }
}
//inicialize fileReader(uploader)
function fileAppStare(){
    $('#container-graph').html('');
    file  = document.querySelector('input[type=file]').files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file, "UTF-8");
    //fr.readAsDataURL(file);

}

//* files parser in parts/parsers

//On change do all
$('#upload-input').on('change',function(){
    handleFileSelect();
    var fileName = document.getElementById('load-file');
    var parseName =  file.name;
    var spanEl = document.getElementById('header-file');
    fileName.innerText = "File Upload: ";
    spanEl.innerText = parseName;
    var nameEl = $('.load-file-name');
    nameEl.addClass('name-show');


});
//creating trend-risk map

function trendsRiskMap(graph){

    $("body").attr("class","map trends-risks");

    // maps trigger
    //delete previous highlight button
    $(".map-list li").removeClass('active');
    //highlighting  map button
    $("#trends-button").addClass("active");


    //clear most connected
    $(".most-connected").html("");

    //hidden left sidebar
    $(".data-area-left").addClass("hidden");


    //main variables
    var
        trendObj = [],
        riskObj = [],
        edges = [],
        categoryObj = {},
        edgesCutTrend  = [],
        edgesCutRisk = [],
        oneTrend = [],
        edgesForThree = [],
        textClasses = {};


    var svg = d3.select("svg"),
        width = +svg.attr("width") ,
        height = +svg.attr("height"),
        halfWidth = width/ 2,
        halfHeight = height/ 2,
        rLage = halfHeight - 20,
        nodesRadius = 4.5,
        strokeWidth = 0.35,
        gainStrokeWidth = 6, //increment current stroke width (stroke width = strokeWidth * gainStrokeWidth)
        inactiveOpacity = 0.2; //value inactive lines opacity (normal opacity = 1 )

    //color palette d3
    var color = d3.scaleOrdinal(d3.schemeCategory20),
        trendsColor = "#AB00AB",
        trendsColorCurrent  = "#E54FBD";

    //classes for text object
    textClasses = {
        "default": "text text-risks",
        "visible": "text text-risks text-visible",
        "hidden": "text text-risks text-hidden",
        "defaultTrend": "text text-trends",
        "visibleTrend": "text text-trends text-visible",
        "hiddenTrend": "text text-trends text-hidden"
    };

    //filtering 'Trends' nodes
    graph.nodes.forEach(function (p) {
        if (p.type === 'Trend') {
            trendObj.push(p);
        }

    });
    //radius function for 'Trends' nodes
    trendObj.forEach(function (p, i) {
        var n = trendObj.length,
            step = (2 * Math.PI) / n,
            angle = i * step;
        p.cx = rLage * Math.cos(angle);
        p.cy = rLage * Math.sin(angle);
    });


    //filtering 'Risk' nodes
    graph.nodes.forEach(function (p) {
        if (p.type === 'Risk') {
            riskObj.push(p);
        }

    });


    //creating object links
    graph.links.forEach(function (e) {
        var sourceNode = graph.nodes.filter(function (n) {
                return n.id === e.source;
            })[0],
            targetNode = graph.nodes.filter(function (n) {
                return n.id === e.target;
            })[0];

        edges.push({source: sourceNode, target: targetNode, value: e.value});
    });

    //created object for risk nodes
    riskObj.forEach(function (e) {
        var categories = e.category;

        if (categoryObj[categories] == undefined) {
            categoryObj[categories] = [];
        }
        categoryObj[categories].push(e);

    });
    //include coordinate in sort object
    var b = 1;
    for (var i in categoryObj) {
        b += 5;

        var n = categoryObj[i].length,
            step = (2 * Math.PI) / n,
            clasterRadius,
            zenith;

        categoryObj[i].forEach(function (e, j) {

            j += 4;

            if (n <= 2) {
                clasterRadius = 250;
                zenith = clasterRadius / 100;
            }
            else if (n <= 4) {
                clasterRadius = 300;
                zenith = clasterRadius / 100;
            }
            else if (n <= 6) {
                clasterRadius = 350;
                zenith = clasterRadius / 100;
            }
            else if (n <= 8) {
                clasterRadius = 300;
                zenith = clasterRadius / 100;
            }
            else if (n <= 10) {
                clasterRadius = 350;
                zenith = clasterRadius / 100;
            }
            else if (n <= 12) {
                clasterRadius = 400;
                zenith = clasterRadius / 100;
            }
            else if (n <= 14) {
                clasterRadius = 450;
                zenith = clasterRadius / 100;
            }
            else if (n <= 16) {
                clasterRadius = 500;
                zenith = clasterRadius / 100;
            }
            if(n <= 4){
                n = 4;
            }

            var angle = j * step;
            e.cx = ( ( Math.cos(b) * (( halfWidth / n / 1.4) * zenith ) ) + ( Math.sin(angle) * ( clasterRadius / j) ) );
            e.cy = ( ( Math.sin(b) * (( halfHeight / n / 1.2) * zenith ) ) + (Math.cos(angle) * ( clasterRadius / j) ) );


        })

    }


//----------------Append in DOM SVG--------------------------------


    //--------------LINKS-----------------------------------------
    //append links
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(edges)
        .enter().append("line")
        .attr("x1", function (d) {
            return d.source.cx + halfWidth;
        })
        .attr("y1", function (d) {
            return d.source.cy + halfHeight;
        })
        .attr("x2", function (d) {
            return d.target.cx + halfWidth;
        })
        .attr("y2", function (d) {
            return d.target.cy + halfHeight;
        })
        .attr("stroke", function (d) {
            return color(d.target.category)
        })
        .attr("stroke-width", strokeWidth)
        .attr("title", function (d) {
            return d.value
        })
        .attr("source", function (d) {
            return d.source.id
        })
        .attr("target", function (d) {
            return d.target.id
        });


    //--------------TRENDS NODES------------------------------------------
    //appends 'g' containers
    var gNode = svg.selectAll(".nodes-trends")
        .data(trendObj)
        .enter().append("g")
        .attr("class", "g-nodes trends")
        .on("click", currentNodeTrend);

    //append nodes in 'g' containers
    var node = gNode
        .append("circle")
        .attr("class", "nodes nodes-trends")
        .attr("id", function (d) {
            return d.id
        })
        .attr("cx", function (d) {
            return d.cx + halfWidth
        })
        .attr("cy", function (d) {
            return d.cy + halfHeight
        })
        .attr("r", function (d) {
            return altNodeSize(d, nodesRadius, 2)
        })
        .attr("fill", trendsColor);

    //add nodes text
    var textTrends = gNode
        .append("text")
        .attr("class", textClasses.hiddenTrend)
        .text(function (d) {
            return d.label || d.id;
        })
        .attr("dx", function (d) {
            return d.cx + halfWidth + 10
        })
        .attr("dy", function (d) {
            return d.cy + halfHeight - 10
        });


    //--------------RISK NODES-----------------------------------------
    //appends 'g' containers
    var rNode = svg.selectAll(".nodes-risks")
        .data(riskObj)
        .enter().append("g")
        .attr("class", "g-nodes risks")
        .on("click", currentNodeRisk);

    //add nodes text
    var textRisks = rNode
        .append("text")
        .attr("class", textClasses.hidden)
        .text(function (d) {
            return d.label || d.id;
        })
        .attr("dx", function (d) {
            return d.cx + halfWidth + 10
        })
        .attr("dy", function (d) {
            return d.cy + halfHeight - 6
        })
        .attr("id", function (d) {
            return d.id
        });


    //append nodes in 'g' containers
    var riskNode = rNode
        .append("circle")
        .attr("class", "nodes nodes-risks")
        .attr("cx", function (d) {
            return d.cx + halfWidth
        })
        .attr("cy", function (d) {
            return d.cy + halfHeight
        })
        .attr("id", function (d) {
            return d.id
        })
        .attr("r", function (d) {
            return altNodeSize(d, nodesRadius, 0)
        })
        .attr("fill", function (d) {
            return color(d.category || d.group);
        });



//----------------filtering Data--------------------------------------
    //clear filter block
    $(".risk-categories").html("");

    //------------Event functions---------------------------------------


//-------------fun on click TRENDS NODES--------------------------------
    function currentNodeTrend() {

        //visible & transform trendsNodes
        d3.selectAll(".nodes-trends")
            .transition()
            .duration(300)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 2)
            })
            .attr("fill", trendsColor);

        d3.select(this).select(".nodes-trends").transition()
            .duration(300)
            .attr("fill", trendsColorCurrent)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 5)
            });

        //visible & transform TEXT
        d3.selectAll(".text-trends")
            .attr("class", textClasses.hiddenTrend)
            .attr("style", "font-size: 0.9em");

        d3.select(this).select(".text-trends")
            .attr("class", textClasses.visibleTrend)
            .attr("style", "font-size: 1em: font-weight: bold");

        //check current node id
        var currentID = d3.select(this).select("circle").attr("id"),
            currentColor = d3.select(this).select("circle").attr("fill");

        //filtering all lines where currentId = source
        d3.selectAll("line")
            .attr("stroke-width", strokeWidth)
            .attr("style", "opacity: " + inactiveOpacity)
            .data(edges)
            .filter(function (d) {
                if (d.source.id == currentID) {
                    edgesCutTrend.push(d.target.id);
                }
                if(d.source.id == currentID){
                    edgesForThree.push({source: d.target, value: d.value});
                    return d.source.id == currentID;

                }


            })
            .attr("stroke-width", strokeWidth * gainStrokeWidth)
            .attr("style", "opacity: 1");


        //filtering current risk nodes
        d3.selectAll(".nodes-risks")
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 1)
            })
            .filter(function (d) {
                return edgesCutTrend.indexOf(d.id) >= 0;

            })
            .transition()
            .duration(300)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 3)
            });


        //abort filtering current text nodes
        d3.selectAll(".text-risks")
            .attr("class", textClasses.hidden)
            .attr("style", "font-weight: normal");
        //filtering current risk-text nodes
        d3.selectAll(".text-risks")
            .filter(function (d) {
                return edgesCutTrend.indexOf(d.id) >= 0;
            })
            .attr("class", textClasses.visible);

        console.log(edgesCutTrend);


        //----Sidebar text data--------------------------


        //create one current object for sidebar data
        trendObj.forEach(function (e) {
            if (e.id == currentID) {
                oneTrend.push(e);
            }
        });


        //sort array to max
        edgesForThree.sort(
            function(a, b) {
                return b.value - a.value;
            }
        );

        //special data sidebar for t-r map (Trends)
        getDataSidebarTrendsMap(oneTrend,currentColor,edgesForThree);


        //change label tn three most connected(trends/risks)
        $("#most-con-label strong").text("Most connected global risks:");

        oneTrend = [];
        edgesCutTrend = [];
        edgesForThree = [];

    }//END currentNodeTrends


//-------fun on click RISKS NODES----------------------------
    function currentNodeRisk(){

        //visible & transform RiskNodes
        d3.selectAll(".nodes-risks")
            .attr("class","nodes nodes-risks")
            .transition()
            .duration(300)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 0)
            });

        d3.select(this).select("circle")
            .attr("class","nodes nodes-risks current-node")
            .transition()
            .duration(300)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 3)
            });

        //visible & transform TEXT
        d3.selectAll(".text-risks")
            .attr("class", textClasses.hidden)
            .attr("style", "font-weight: normal");

        d3.select(this).select(".text-risks")
            .attr("class", textClasses.visible)
            .attr("style", "font-weight: bold; font-size: 0.9em");

        //check current node id
        var currentID = d3.select(this).select("circle").attr("id"),
            currentColor = d3.select(this).select("circle").attr("fill");

        //filtering all lines where currentId = target
        d3.selectAll("line")
            .attr("stroke-width", strokeWidth)
            .attr("style", "opacity: " + inactiveOpacity)
            .data(edges)
            .filter(function (d) {
                if (d.target.id == currentID && d.source.type == "Trend") {
                    edgesCutRisk.push(d.source.id);
                    edgesForThree.push({source: d.source, value: d.value});

                }
                if (d.source.type == "Trend") {
                    return d.target.id == currentID;

                }

            })
            .attr("stroke-width", strokeWidth * gainStrokeWidth)
            .attr("style", "opacity: 1");


        //filtering current trend nodes
        d3.selectAll(".nodes-trends")
            .attr("fill", trendsColor)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 2)
            })
            .filter(function (d) {
                return edgesCutRisk.indexOf(d.id) >= 0;
            })
            .transition()
            .duration(300)
            .attr("fill", trendsColorCurrent)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 5)
            });

        //filtering corresponding text trends
        d3.selectAll(".text-trends")
            .attr("class", textClasses.hiddenTrend)
            .attr("style", "font-size: inherit");


        d3.selectAll(".text-trends")
            .filter(function (d) {
                return edgesCutRisk.indexOf(d.id) >= 0;
            })
            .attr("class", textClasses.visibleTrend)
            .attr("style", "font-size: 0.8em");


        d3.selectAll(".trend-risk")
            .text("risk");


        //----Sidebar text data--------------------------

        //create one current object for sidebar data
        riskObj.forEach(function (e) {
            if (e.id == currentID) {
                oneTrend.push(e);
            }
        });


        //sort array to max
        edgesForThree.sort(
            function(a, b) {
                return b.value - a.value;
            }
        );


        //general sidebar data function (common-functions template)
        getDataSidebar(riskObj, oneTrend, currentColor, edgesForThree);

        //change label the three most connected(trends/risks)
        $("#most-con-label strong").text("Most connected global trends:");

        //clearing array
        oneTrend = [];
        edgesCutRisk = [];
        edgesForThree = [];

    }//END currentNodeRisk




    //-----------------Three most connected call feedback functions-----------
        //---Trend
    function threeNodeFunTmap(cutOfThree){

        var currentID,
            currentColor,
            edgesCutRiskThree = [];

        currentID = cutOfThree;

        //visible & transform RiskNodes
        d3.selectAll(".nodes-risks")
            .transition()
            .duration(300)
            .attr("class","nodes nodes-risks")
            .attr("r", function(d){
                return altNodeSize(d, nodesRadius,0)
            });

        svg.selectAll(".nodes-risks")
            .filter(function (d) {
                return d.id == currentID;
            })
            .transition()
            .duration(300)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 2)
            });


        //visible & transform TEXT
        d3.selectAll(".text-risks")
            .attr("class", textClasses.hidden)
            .attr("style", "font-weight: normal");

        d3.selectAll(".text-risks")
            .filter(function (d) {
                return d.id == currentID;
            })
            .attr("class", textClasses.visible)
            .attr("style", "font-weight: bold; font-size: 0.9em");



        //filtering all lines where currentId = source
        d3.selectAll("line")
            .attr("stroke-width", function(d){
                return altStrength(d, strokeWidth, 0);
            })
            .attr("style", "opacity: " + inactiveOpacity)
            .attr("class", "")
            .data(edges)
            .filter(function (d) {
                if (d.target.id == currentID && d.source.type == "Trend" ) {
                    edgesCutRiskThree.push(d.source.id);
                    edgesForThree.push({source: d.source, value: d.value});
                }
                if (d.source.type == "Trend") {

                    return d.target.id == currentID;
                }

            })
            .attr("stroke-width", strokeWidth * gainStrokeWidth)
            .attr("style", "opacity: 1");

        //filtering current trend nodes
        d3.selectAll(".nodes-trends")
            .attr("fill", trendsColor)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 2)
            })
            .filter(function (d) {
                return edgesCutRiskThree.indexOf(d.id) >= 0;
            })
            .transition()
            .duration(300)
            .attr("fill", trendsColorCurrent)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 5)
            });


        d3.selectAll(".text-trends")
            .filter(function (d) {
                return edgesCutRiskThree.indexOf(d.id) >= 0;
            })
            .attr("class", textClasses.visibleTrend)
            .attr("style", "font-size: 0.8em");


        d3.selectAll(".trend-risk")
            .text("risk");


        //----Sidebar text data--------------------------

        //create one current object for sidebar data
        riskObj.forEach(function (e) {
            if (e.id == currentID) {
                oneTrend.push(e);
            }
        });

        //sort array to max
        edgesForThree.sort(
            function(a, b) {
                return b.value - a.value;
            }
        );

        //category color
        var io = d3.selectAll(".nodes")
            .filter(function(d){
                return d.id == currentID
            })
            .attr("fill");

        currentColor = io;


        //general sidebar data function (common-functions template)
        getDataSidebar(riskObj, oneTrend, currentColor, edgesForThree);

        //clearing array
        oneTrend = [];
        edgesCutRiskThree = [];
        edgesForThree = [];

    }//End threeNodeFunTmap


    //--Risk
    function threeNodeFunTmapR(cutOfThree){

        var currentID,
            currentColor,
            edgesCutTrendThree = [];

        currentID = cutOfThree;

        //visible & transform trendsNodes
        d3.selectAll(".nodes-trends")
            .transition()
            .duration(300)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 2)
            })
            .attr("fill", trendsColor);

        d3.selectAll(".nodes-trends")
            .filter(function(d){
                return d.id == currentID;
            })
            .transition()
            .duration(300)
            .attr("fill", trendsColorCurrent)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 5)
            });

        //visible & transform TEXT
        d3.selectAll(".text-trends")
            .attr("class", textClasses.hiddenTrend)
            .attr("style", "font-size: 0.9em");

        d3.selectAll(".text-trends")
            .filter(function(d){
                return d.id == currentID
            })
            .attr("class", textClasses.visibleTrend)
            .attr("style", "font-size: 1em: font-weight: bold");


        //category color
        var io = d3.selectAll(".nodes-trends")
            .filter(function(d){
                return d.id == currentID
            })
            .attr("fill");

        currentColor = io;

        //filtering all lines where currentId = source
        d3.selectAll("line")
            .attr("stroke-width", strokeWidth)
            .attr("style", "opacity: " + inactiveOpacity)
            .data(edges)
            .filter(function (d) {
                if (d.source.id == currentID) {
                    edgesCutTrendThree.push(d.target.id);
                }
                if(d.source.id == currentID){
                    edgesForThree.push({source: d.target, value: d.value});
                    return d.source.id == currentID;
                }

            })
            .attr("stroke-width", strokeWidth * gainStrokeWidth)
            .attr("style", "opacity: 1");


        //filtering current risk nodes
        d3.selectAll(".nodes-risks")
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 1)
            })
            .filter(function (d) {
                return edgesCutTrendThree.indexOf(d.id) >= 0;

            })
            .transition()
            .duration(300)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 3)
            });


        //abort filtering current text nodes
        d3.selectAll(".text-risks")
            .attr("class", textClasses.hidden)
            .attr("style", "font-weight: normal");
        //filtering current risk-text nodes
        d3.selectAll(".text-risks")
            .filter(function (d) {
                return edgesCutTrendThree.indexOf(d.id) >= 0;
            })
            .attr("class", textClasses.visible);


        //----Sidebar text data--------------------------


        //create one current object for sidebar data
        trendObj.forEach(function (e) {
            if (e.id == currentID) {
                oneTrend.push(e);
            }
        });


        //sort array to max
        edgesForThree.sort(
            function(a, b) {
                return b.value - a.value;
            }
        );


        //special data sidebar for t-r map (Trends)
        getDataSidebarTrendsMap(oneTrend,currentColor,edgesForThree);

        oneTrend = [];
        edgesCutTrendThree = [];
        edgesForThree = [];


    }//End threeNodeFunTmapR



    //function on click most connected button
        //Risk
    $(document).on("click", ".most-connected .m-risk",function() {

        if($("body").hasClass("trends-risks")){

        var cutOfThree  = $(this).attr("mid");
            threeNodeFunTmap(cutOfThree);

        }
    });
        //Trend
    $(document).on("click", ".most-connected .m-node",function() {

        if($("body").hasClass("trends-risks")) {

            var cutOfThree = $(this).attr("mid");
            threeNodeFunTmapR(cutOfThree);

        }

    });




//-----------------------CURRENT NODE-----------------------------------------------

    var
        edgesCutRiskCur = [],
        //save current node
        currNode = $(".trends-selected").attr("curid"),
        typeOfRisk = $(".trend-risk").text();

    if(currNode != "empty" && typeOfRisk != "trend") {
        svg.selectAll(".nodes-risks")
            .filter(function (d) {
                return d.id == currNode;
            })
            .transition()
            .duration(300)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 3)
            });

        d3.selectAll(".text-risks")
            .filter(function (d) {
                return d.id == currNode;
            })
            .attr("class", textClasses.visible)
            .attr("style", "font-weight: bold; font-size: 0.9em");



        //filtering all lines where currentId = target
        d3.selectAll("line")
            .attr("stroke-width", strokeWidth)
            .attr("style", "opacity: " + inactiveOpacity)
            .data(edges)
            .filter(function (d) {
                if (d.target.id == currNode && d.source.type == "Trend") {
                    edgesCutRiskCur.push(d.source.id);
                    edgesForThree.push({source: d.source, value: d.value});
                }
                if (d.source.type == "Trend") {
                    return d.target.id == currNode;
                }
            })
            .attr("stroke-width", strokeWidth * gainStrokeWidth)
            .attr("style", "opacity: 1");


        d3.selectAll(".text-trends")
            .filter(function (d) {
                return edgesCutRiskCur.indexOf(d.id) >= 0;
            })
            .attr("class", textClasses.visibleTrend)
            .attr("style", "font-size: 0.8em");


        //filtering current trend nodes
        d3.selectAll(".nodes-trends")
            .attr("fill", trendsColor)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 2)
            })
            .filter(function (d) {
                return edgesCutRiskCur.indexOf(d.id) >= 0;
            })
            .transition()
            .duration(300)
            .attr("fill", trendsColorCurrent)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 5)
            });

        //sort array to max
        edgesForThree.sort(
            function(a, b) {
                return b.value - a.value;
            }
        );


        partSideMostThreeTrends(edgesForThree);
        $("#most-con-label strong").text("Most connected global trends:");
        $(".most-connected li").removeClass("m-risk").addClass("m-node");


        edgesCutRiskCur = [];
        edgesForThree = [];

    }

//-----------------------END CURRENT NODE-----------------------------------------------


//-------------ABORTING filters FUNCTION--------------------------------------------

    //generic clearing function
    function clearTrendMap(){

        d3.selectAll(".nodes-trends")
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 2)
            })
            .attr("fill", trendsColor);

        d3.selectAll(".nodes-risks")
            .attr("class","nodes nodes-risks")
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 0)
            });

        d3.selectAll(".text-trends")
            .attr("class", textClasses.hiddenTrend)
            .attr("style", "font-weight: normal");

        d3.selectAll(".text-risks")
            .attr("class", textClasses.hidden)
            .attr("style", "font-weight: normal");

        d3.selectAll("line")
            .attr("stroke-width", strokeWidth)
            .attr("style", "opacity: 1");

        //----Sidebar text data clearing--------------------------

        d3.selectAll(".data-area")
            .attr("class","data-area hidden");

        //clearing all sidebar data text
        d3.selectAll(".s-data-text")
            .text("");

        //clear current node
        $(".trends-selected").attr("curid","empty");

    }
    //clear button
    $("#clear-filter").click(function() {
        clearTrendMap();

    });

    //clear all on page on blur
    $("#graph-wrapper").click(function (e) {
        if(e.target.id != 'container-graph')
            return;
        clearTrendMap();

    });






}//End trendsRiskMap
//creating risk-interconnections map

function riskInterconMap(graph){

    $("body").attr("class","map interconnections");


    // maps trigger
    //delete previous highlight button
    $(".map-list li").removeClass('active');
    //highlighting  map button
   $("#intercon-button").addClass("active");

    //clear most connected
    $(".most-connected").html("");

    $(".data-area-left").addClass("hidden");


    //main variables
    var
        riskObj = [],
        edges = [],
        categoryObj = {},
        edgesCutRisk = [],
        oneTrend = [],
        linksCut = [],
        edgesForThree = [],
        textClasses = {};


    var svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height"),
        halfWidth = width/ 2 - 50,
        halfHeight = height/ 2,
        nodesRadius = 4,
        strokeWidth = 0.5,
        edgesColor = "#a5a5a5",
        inactiveOpacity = 0.2; //value inactive lines opacity (normal opacity = 1 )



    //color palette d3
    var color = d3.scaleOrdinal(d3.schemeCategory20);


    //classes for text object
    textClasses = {
        "default": "text text-risks",
        "visible": "text text-risks text-visible",
        "hidden": "text text-risks text-hidden"
    };



    //filtering 'Risk' nodes
    graph.nodes.forEach(function (p) {
        if (p.type === 'Risk') {
            riskObj.push(p);
        }

    });



    //creating object links
    graph.links.forEach(function (e) {

        if(e.type == "Risk-Risk"){
            linksCut.push(e)
        }
    });

    linksCut.forEach(function(e){
        var sourceNode = riskObj
                .filter(function (n) {
                    return n.id === e.source;
                })[0],

            targetNode = riskObj
                .filter(function (n) {
                    return n.id === e.target;
                })[0];

        edges.push({source: sourceNode, target: targetNode, value: e.value});
    });

    //created object for risk nodes
    riskObj.forEach(function (e) {
        var categories = e.category;

        if (categoryObj[categories] == undefined) {
            categoryObj[categories] = [];
        }
        categoryObj[categories].push(e);

    });

    //include coordinate in sort object

    var countCategories = Object.keys(categoryObj).length, //count of categories

        polygon = {
            x:[0,20,40,60,40,20, 15,25,35,45,55,65],
            y:[0,-20,-15,5,15,20, -3,-8,-23,-13,2,8],

            xHeight: [-10,10,30,50,30,10, 5,15,25,35,45,55],
            yHeight:[-10,-30,-25,-5,5,10, -13,-18,-32,-23,2,-8],

            xLow: [10,30,50,70,50,30, 25,35,45,55,65,75],
            yLow:[10,-10,-5,15,25,30, 7,2,-13,-3,18,8]

        };

    var sCluster = 3.6, //clusters size
        heightGain = 1.6;


    if(halfHeight <= 400){
        sCluster = 3.2;
        heightGain = 1.8;
    }


    if(countCategories > 5){
        halfHeight = halfHeight - 100;
        halfWidth = halfWidth -100
    }

                            //1
    if(categoryObj[Object.keys(categoryObj)[0]]) {
        categoryObj[Object.keys(categoryObj)[0]].forEach(function (e, j) {

            e.cx = polygon.x[j] * sCluster;
            e.cy = polygon.y[j] * sCluster - halfHeight / heightGain;

        });
    }

                            //2
    if(categoryObj[Object.keys(categoryObj)[1]]) {
        categoryObj[Object.keys(categoryObj)[1]].forEach(function (e, j) {
            e.cx = polygon.x[j] * sCluster + halfWidth / 2.2;
            e.cy = polygon.y[j] * sCluster;

        });
    }

                         //3
    if(categoryObj[Object.keys(categoryObj)[2]]) {
        categoryObj[Object.keys(categoryObj)[2]].forEach(function (e, j) {


            e.cx = (polygon.xLow[j] - 5) * sCluster;
            e.cy = (polygon.yLow[j] + 5)  * sCluster;
        });
    }

    if(categoryObj[Object.keys(categoryObj)[2]]) {                       //4
        categoryObj[Object.keys(categoryObj)[3]].forEach(function (e, j) {
          e.cx = (polygon.xHeight[j] + 5) * sCluster - halfWidth / 2.2;
          e.cy = (polygon.yHeight[j] - 5) * sCluster;

        });
    }

                            //5
    if(categoryObj[Object.keys(categoryObj)[4]]) {
        categoryObj[Object.keys(categoryObj)[4]].forEach(function (e, j) {

            e.cx = (polygon.x[j] + 10)  * sCluster;
            e.cy = (polygon.y[j] +5 ) * sCluster + halfHeight / heightGain;

        });

    }
                            //6
    if(categoryObj[Object.keys(categoryObj)[5]]) {
        categoryObj[Object.keys(categoryObj)[5]].forEach(function (e, j) {


            e.cx = (polygon.xHeight[j] + 5) * sCluster - halfWidth / 2.2;
            e.cy = polygon.yHeight[j] * sCluster + halfHeight / heightGain;

        });
    }
                            //7
    if(categoryObj[Object.keys(categoryObj)[6]]) {
        categoryObj[Object.keys(categoryObj)[6]].forEach(function (e, j) {

           e.cx = polygon.xLow[j] * sCluster + halfWidth / 2.2;
           e.cy = polygon.yLow[j] * sCluster + halfHeight / heightGain;

        });
    }
                            //8
    if(categoryObj[Object.keys(categoryObj)[7]]) {
        categoryObj[Object.keys(categoryObj)[7]].forEach(function (e, j) {

            e.cx = polygon.x[j] * sCluster - halfHeight / heightGain ;
            e.cy = polygon.y[j] * sCluster - halfWidth / 2.2;

        });
    }


//----------------Append in DOM SVG--------------------------------

    //--------------LINKS-----------------------------------------
    //append links
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(edges)
        .enter().append("line")
        .attr("x1", function (d) {
            return d.source.cx + halfWidth;
        })
        .attr("y1", function (d) {
            return d.source.cy + halfHeight;
        })
        .attr("x2", function (d) {
            return d.target.cx + halfWidth;
        })
        .attr("y2", function (d) {
            return d.target.cy + halfHeight;
        })
        .attr("stroke", edgesColor)
        .attr("source", function (d) {
            return d.source.id
        })
        .attr("target", function (d) {
            return d.target.id
        })
        .attr("stroke-width", function(d){
            return altStrength(d,strokeWidth, 0);
         });

    //--------------RISK NODES-----------------------------------------
    //appends 'g' containers
    var rNode = svg.selectAll(".nodes-risks")
        .data(riskObj)
        .enter().append("g")
        .attr("class", "g-nodes risks")
        .on("click", currentNodeRisk);

    //add nodes text
    var textRisks = rNode
        .append("text")
        .attr("class", textClasses.hidden)
        .text(function (d) {
            return d.label || d.id;
        })
        .attr("dx", function (d) {
            return d.cx + halfWidth - 14;
        })
        .attr("dy", function (d) {
            return d.cy + halfHeight - 8;
        })
        .attr("id", function (d) {
            return d.id
        });

    //append nodes in 'g' containers
    var riskNode = rNode
        .append("circle")
        .attr("class", "nodes nodes-risks")
        .attr("cx", function (d) {
            return d.cx + halfWidth
        })
        .attr("cy", function (d) {
            return d.cy + halfHeight
        })
        .attr("id", function (d) {
            return d.id
        })
        .attr("r", function(d){
            return altNodeSize(d, nodesRadius, 0) })
        .attr("fill", function (d) {
            return color(d.category || d.group);
        });



//----------------filtering Data--------------------------------------
    //clear filter block
    $(".risk-categories").html("");



//-------function on click RISKS NODES----------------------------
    function currentNodeRisk() {
        $(".data-area-left").removeClass("hidden");
        //visible & transform RiskNodes
        d3.selectAll(".nodes-risks")
            .transition()
            .duration(300)
            .attr("class","nodes nodes-risks")
            .attr("r", function(d){
                return altNodeSize(d, nodesRadius,0) });

        d3.select(this).select("circle").transition()
            .duration(300)
            .attr("class","nodes nodes-risks current-node")
            .attr("r", function(d){
                return altNodeSize(d, nodesRadius,2)
            });

        //visible & transform TEXT
        d3.selectAll(".text-risks")
            .attr("class", textClasses.hidden)
            .attr("style", "font-weight: normal");

        d3.select(this).select(".text-risks")
            .attr("class", textClasses.visible)
            .attr("style", "font-weight: bold; font-size: 0.9em");

        //check current node id
        var currentID = d3.select(this).select("circle").attr("id"),
            currentColor = d3.select(this).select("circle").attr("fill");


        //filtering all lines where currentId = source
        d3.selectAll("line")
            .attr("stroke-width", function(d){
                return altStrength(d, strokeWidth, 0);
            })
            .attr("style", "opacity: " + inactiveOpacity)
            .attr("class", "")
            .data(edges)
            .filter(function (d) {
                if (d.source.id == currentID) {
                    edgesCutRisk.push(d.target.id);
                    edgesForThree.push({source: d.target, value: d.value});
                }
                    return d.source.id == currentID;

            })
            .attr("style", "opacity: 1")
            .attr("class", "current-line")
            .attr("stroke-width", function(d) {
                return altStrength(d,strokeWidth, 2.5);
            });


        //filtering all links where currentId = target
        d3.selectAll("line")
            .filter(function (d) {
                if (d.target.id == currentID) {
                    edgesCutRisk.push(d.source.id)
                }
                return d.target.id == currentID;
            })
            .attr("style", "opacity: 1")
            .attr("class", "current-line")
            .attr("stroke-width", function(d) {
                return altStrength(d,strokeWidth, 2.5);
            });

        d3.selectAll(".text-risks")
            .attr("style", "font-size: 0.6em")
            .filter(function (d) {
                return edgesCutRisk.indexOf(d.id) >= 0;
            })
            .attr("class", textClasses.visible)
            .attr("style", "font-size: 0.8em");

        //text current id node
        d3.selectAll(".text-risks")
            .filter(function (d) {
                return d.id == currentID;
            })
            .attr("style", "font-size: 0.8em; font-weight: bold");




        //----Sidebar text data--------------------------

        //create one current object for sidebar data
        riskObj.forEach(function (e) {
            if (e.id == currentID) {
                oneTrend.push(e);
            }
        });


        //sort array to max
        edgesForThree.sort(
            function(a, b) {
                return b.value - a.value;
            }
        );


        //general sidebar data function (common-functions template)
        getDataSidebar(riskObj, oneTrend, currentColor, edgesForThree);


        //clearing array
        oneTrend = [];
        edgesCutRisk = [];
        edgesForThree = [];


    }//END currentNodeRisk(Click)





//-----------------------CURRENT NODE-----------------------------------------------


    function currentNode(){
        var edgesCutRiskCur = [],
        //save current node
            currNode = $(".trends-selected").attr("curid"),
            typeOfRisk = $(".trend-risk").text();

        if(currNode != "empty" && typeOfRisk != "trend") {

            svg.selectAll(".nodes-risks")
                .filter(function (d) {
                    return d.id == currNode;
                })
                .transition()
                .duration(300)
                .attr("r", function (d) {
                    return altNodeSize(d, nodesRadius, 2)
                });

            d3.selectAll(".text-risks")
                .filter(function (d) {
                    return d.id == currNode;
                })
                .attr("class", textClasses.visible)
                .attr("style", "font-weight: bold; font-size: 0.9em");

            d3.selectAll("line")
                .attr("style", "opacity: 1");

            //filtering all lines where currentId = source
            d3.selectAll("line")
                .attr("stroke-width", function (d) {
                    return altStrength(d, strokeWidth, 0);
                })
                .attr("style", "opacity: " + inactiveOpacity)
                .attr("class", "")
                .data(edges)
                .filter(function (d) {
                    if (d.source.id == currNode) {
                        edgesCutRiskCur.push(d.target.id);
                        edgesForThree.push({source: d.target, value: d.value});
                    }
                    return d.source.id == currNode;

                })
                .attr("style", "opacity: 1")
                .attr("class", "current-line")
                .attr("stroke-width", function (d) {
                    return altStrength(d, strokeWidth, 2.5);
                });


            //filtering all links where currentId = target
            d3.selectAll("line")
                .filter(function (d) {
                    if (d.target.id == currNode) {
                        edgesCutRiskCur.push(d.source.id)
                    }
                    return d.target.id == currNode;
                })
                .attr("style", "opacity: 1")
                .attr("class", "current-line")
                .attr("stroke-width", function (d) {
                    return altStrength(d, strokeWidth, 2.5);
                });

            //filtering all text labels
            d3.selectAll(".text-risks")
                .filter(function (d) {
                    return edgesCutRiskCur.indexOf(d.id) >= 0;
                })
                .attr("class", textClasses.visible)
                .attr("style", "font-size: 0.8em");


            //sort array to max
            edgesForThree.sort(
                function(a, b) {
                    return b.value - a.value;
                }
            );


            partSideMostThreeTrends(edgesForThree);
            //change label tn three most connected(trends/risks)
            $("#most-con-label strong").text("Most connected global risks:");

            edgesCutRiskCur = [];
            edgesForThree = [];

        }
    }//end current node

    currentNode();

//-----------------Three most connected----------------------
    function threeNodeFun(cutOfThree){

        var currentID,
            currentColor;

        currentID = cutOfThree;

        //visible & transform RiskNodes
        d3.selectAll(".nodes-risks")
            .transition()
            .duration(300)
            .attr("class","nodes nodes-risks")
            .attr("r", function(d){
                return altNodeSize(d, nodesRadius,0) 
            });

        svg.selectAll(".nodes-risks")
            .filter(function (d) {
                return d.id == currentID;
            })
            .transition()
            .duration(300)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 2)
            });


        //visible & transform TEXT
        d3.selectAll(".text-risks")
            .attr("class", textClasses.hidden)
            .attr("style", "font-weight: normal");

        d3.selectAll(".text-risks")
            .filter(function (d) {
                return d.id == currentID;
            })
            .attr("class", textClasses.visible)
            .attr("style", "font-weight: bold; font-size: 0.9em");



        //filtering all lines where currentId = source
        d3.selectAll("line")
            .attr("stroke-width", function(d){
                return altStrength(d, strokeWidth, 0);
            })
            .attr("style", "opacity: " + inactiveOpacity)
            .attr("class", "")
            .data(edges)
            .filter(function (d) {
                if (d.source.id == currentID) {
                    edgesCutRisk.push(d.target.id);
                    edgesForThree.push({source: d.target, value: d.value});
                }
                return d.source.id == currentID;

            })
            .attr("style", "opacity: 1")
            .attr("class", "current-line")
            .attr("stroke-width", function(d) {
                return altStrength(d,strokeWidth, 2.5);
            });


        //filtering all links where currentId = target
        d3.selectAll("line")
            .filter(function (d) {
                if (d.target.id == currentID) {
                    edgesCutRisk.push(d.source.id)
                }
                return d.target.id == currentID;
            })
            .attr("style", "opacity: 1")
            .attr("class", "current-line")
            .attr("stroke-width", function(d) {
                return altStrength(d,strokeWidth, 2.5);
            });

        d3.selectAll(".text-risks")
            .attr("style", "font-size: 0.6em")
            .filter(function (d) {
                return edgesCutRisk.indexOf(d.id) >= 0;
            })
            .attr("class", textClasses.visible)
            .attr("style", "font-size: 0.8em");

        //text current id node
        d3.selectAll(".text-risks")
            .filter(function (d) {
                return d.id == currentID;
            })
            .attr("style", "font-size: 0.8em; font-weight: bold");


        //----Sidebar text data--------------------------

        //create one current object for sidebar data
        riskObj.forEach(function (e) {
            if (e.id == currentID) {
                oneTrend.push(e);
            }
        });


        //sort array to max
        edgesForThree.sort(
            function(a, b) {
                return b.value - a.value;
            }
        );

        //category color
        var io = d3.selectAll(".nodes-risks")
            .filter(function(d){
                return d.id == currentID
            })
            .attr("fill");

        currentColor = io;

        //general sidebar data function (common-functions template)
        getDataSidebar(riskObj, oneTrend, currentColor, edgesForThree);

        //clearing array
        oneTrend = [];
        edgesCutRisk = [];
        edgesForThree = [];

     }//End threeNodeFun
//-----------------------END CURRENT NODE-----------------------------------------------


    //function on click most connected button

        $(document).on("click", ".most-connected li",function() {
            if($("body").hasClass("interconnections")){

                var cutOfThree  = $(this).attr("mid");
                threeNodeFun(cutOfThree);
            }
        });




    //-------------ABORTING filters FUNCTION--------------------------------------------

    //generic clearing function
    function clearRimMap(){
        d3.selectAll(".nodes-risks")
            .attr("class","nodes nodes-risks")
            .attr("r", function(d){
                return altNodeSize(d, nodesRadius,0) });


        d3.selectAll(".text-risks")
            .attr("class", "text text-risks text-hidden")
            .attr("style", "font-weight: normal");

        d3.selectAll("line")
            .data(edges)
            .attr("stroke-width", function(d){
                return altStrength(d,strokeWidth,0);

            })
            .attr("style", "opacity: 1")
            .attr("class", "");

        //----Sidebar text data clearing--------------------------

        d3.selectAll(".data-area")
            .attr("class","data-area hidden");

        d3.selectAll(".data-area-left")
            .attr("class","data-area hidden");

        //clearing all sidebar data text
        d3.selectAll(".s-data-text")
            .text("");

        //clear current node
        $(".trends-selected").attr("curid","empty");

    }
    //clear button
    $("#clear-filter").click(function () {
        clearRimMap();

    });

    //clear all on page on blur
    $("#graph-wrapper").click(function (e) {
        if(e.target.id != 'container-graph')
            return;
        clearRimMap();

    });

    //-------------END ABORTING filters FUNCTION--------------------------------------------



}//End riskInterconMap
//creating Landscape map

function landscapeMap(graph){

    $("body").attr("class","map landscape-map");

    // maps trigger
    //delete previous highlight button
    $(".map-list li").removeClass('active');
    //highlighting  map button
    $("#landscape-map").addClass("active");


    //color palette d3
    var color = d3.scaleOrdinal(d3.schemeCategory20);

    //main variables
    var
        riskObj = [],
        oneTrend = [],
        nodesRadius = 5,
        textClasses = {};


    //classes for text object
    textClasses = {
        "default": "text text-risks",
        "visible": "text text-risks text-visible",
        "hidden": "text text-risks text-hidden"
    };



    var svg = d3.select("svg"),
        margin = {top: 80, right: 160, bottom: 80, left: 80},
        width = +svg.attr("width")- margin.left - margin.right ,
        height = +svg.attr("height") - margin.top - margin.bottom;


    //filtering 'Risk' nodes
    graph.nodes.forEach(function (p) {
        if (p.type === 'Risk') {
            riskObj.push(p);
        }

    });


    var xValue = function(d) { return d.likelihood;}, // data -> value
        yValue = function(d) { return d.impact;}, // data -> value
        xScale = d3.scaleLinear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.axisBottom().scale(xScale),

        yScale = d3.scaleLinear().range([height , 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.axisLeft().scale(yScale);




//----------------Append in DOM SVG--------------------------------


    var mainG = svg
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //Closeness of nodes
    xScale.domain([d3.min(riskObj, xValue)-0.5, d3.max(riskObj, xValue)+0.5]);
    yScale.domain([d3.min(riskObj, yValue)-0.2, d3.max(riskObj, yValue)+0.2]);


    // x-axis
    mainG
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .attr("fill", "#000")
        .style("text-anchor", "end")
        .text("likelihood");

    // y-axis
    mainG
        .append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        //.attr("x", -5)
        .attr("y", 10)
        .attr("fill", "#000")
        .attr("dy", ".5em")
        .style("text-anchor", "end")
        .text("Impact");



    //sort array to max
    riskObj.sort(
        function(a, b) {
            return a.impact - b.impact;
        }
    );

    //function for different label position
    for(var b= 0, a=0; b < riskObj.length; b++ ) {

        if(a == 0 ){
            riskObj[b].textAncorY = "translate(6,-10)";
            a++;
        }
        else if(a == 1){
            riskObj[b].textAncorY = "translate(6, 0)";
            a++;
        }
        else{
            riskObj[b].textAncorY = "translate(-40,14)";
            a = 0;
        }

    }


    //appends 'g' containers
    var rNode = svg.selectAll(".nodes-risks")
        .data(riskObj)
        .enter().append("g")
        .attr("class", "g-nodes risks shape")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on("click", currentNodeRisk)
        .attr("cat",function(d){
            return d.category
        });


          

    //append nodes in 'g' containers
    var riskNode = rNode
        .append("circle")
        .attr("class", "nodes nodes-risks")
        .attr("cx", xMap )
        .attr("cy", yMap )
        .attr("r", function(d){
            return altNodeSize(d, nodesRadius, 0) })
        .attr("fill", function (d) {
            return color(d.category || d.group);
        })
        .attr("style","stroke: none")
        .attr("id", function (d) {
            return d.id
        });


    //add nodes text
    var textRisks = rNode
        .append("text")
        .attr("class", textClasses.hidden)
        .attr("x", xMap)
        .attr("y", yMap)
        .attr("dy","1")
        .data(riskObj)
        .attr("id", function (d) {
            return d.id
        })
        .attr("transform", function(d){
            return d.textAncorY
        })
        .text(function (d) {
            return d.label;
        })
    
        .call(wrap, 50);


 

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.2, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = text.attr("dy") ? text.attr("dy") : 0;
        tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");


        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));

            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}


//-----------------Common functions---------------------------------------------
    /*
     * Landscape map function for category filter
     */
    var cat = [],
        uniqueTextObj = {},
        uniqueColorObj = {},
        colorObj = [];

//creating object for buttons = category
    riskObj.forEach(function(e){
        cat.push(e.category);
    });

//creating object for buttons color = category color
    $(".g-nodes .nodes-risks").each(function(){
        colorObj.push($(this).attr("fill"));
    });
    //function for uniq arrays
    function returnUnique(arr,color) {

        for (var i = 0, i_max = arr.length; i < i_max; i++) {
            uniqueTextObj[arr[i]] = "";
        }


        for (var j = 0, j_max = color.length; j < j_max; j++) {
            uniqueColorObj[color[j]] = "";
        }
        return Object.keys(uniqueTextObj), Object.keys(uniqueColorObj);


    }
    returnUnique(cat,colorObj);
//-----------------------------------------------------------------------

//-----------------CATEGORY FILTER---------------------------------------
    //append filter category block
    var catCont = $(".risk-categories");
    //clear filter block
    catCont.html("");

    //add category buttons
    function getCategoriesSide(catContIn, uniqueTextObj,uniqueColorObj ){
        catContIn.append("<h4 class='sidebar-main-header'>Filters:</h4>");
        catContIn.append("<ul></ul>");

        Object.keys(uniqueTextObj).forEach(function(e,i){

            var color = Object.keys(uniqueColorObj)[i];

            $(".risk-categories ul").append("<li class='cat-item' style='background-color: "+color+"' >" + e + "</li>");
        });
    }
    getCategoriesSide(catCont, uniqueTextObj,uniqueColorObj);

    //function on click button category
    $(".risk-categories ul li").on("click", function(){

        $(this).parent().find('li').removeClass("active");
        $(this).addClass("active");

       var currentButtonCat =  $(this).text();
        svg.selectAll(".g-nodes")
            .attr("style", "opacity:0");

        svg.selectAll(".g-nodes")
            .filter(function(d){
                return d.category == currentButtonCat;
            })
            .attr("style", "opacity:1");
    });

//-----------------COMPARATIVE FILTERS---------------------------------------

    //function on click button compare
    $(".compare-container ul li").on("click", function(){

        $(this).parent().find('li').removeClass("active");
        $(this).addClass("active");

    });


    //-------function on click RISKS NODES----------------------------
    function currentNodeRisk() {

        //visible & transform RiskNodes
        d3.selectAll(".nodes-risks")
            .transition()
            .duration(300)
            .attr("class","nodes nodes-risks")
            .attr("r", function(d){
                return altNodeSize(d, nodesRadius,0) });

        d3.select(this).select("circle").transition()
            .duration(300)
            .attr("class","nodes nodes-risks current-node")
            .attr("r", function(d){
                return altNodeSize(d, nodesRadius,2) });

        //visible & transform TEXT
        d3.selectAll(".text-risks")
            .attr("class",  textClasses.hidden)
            .attr("style", "font-weight: normal");

        d3.select(this).select(".text-risks")
            .attr("class", textClasses.visible)
            .attr("style", "font-weight: bold; font-size: 0.9em");

        //check current node id
        var currentID = d3.select(this).select("circle").attr("id"),
            currentColor = d3.select(this).select("circle").attr("fill");

        //text current id node
        d3.selectAll(".text-risks")
            .filter(function (d) {
                return d.id == currentID;
            })
            .attr("style", "font-size: 0.8em; font-weight: bold");


        //----Sidebar text data--------------------------

        //create one current object for sidebar data
        riskObj.forEach(function (e) {
            if (e.id == currentID) {
                oneTrend.push(e);
            }
        });

        //general sidebar data function (common-functions template)
        getDataSidebar(riskObj, oneTrend, currentColor);


        //clearing array
        oneTrend = [];


    }//END currentNodeRisk


//-----------------------CURRENT NODE-----------------------------------------------

    //save current node
    var currNode = $(".trends-selected").attr("curid"),
        typeOfRisk = $(".trend-risk").text();

    if(currNode != "empty" && typeOfRisk != "trend") {
        svg.selectAll(".nodes-risks")
            .filter(function (d) {
                return d.id == currNode;
            })
            .transition()
            .duration(300)
            .attr("r", function (d) {
                return altNodeSize(d, nodesRadius, 2)
            });

        d3.selectAll(".text-risks")
            .filter(function (d) {
                return d.id == currNode;
            })
            .attr("class", textClasses.visible)
            .attr("style", "font-weight: bold; font-size: 0.9em");

    }


    //-------------ABORTING filters FUNCTION--------------------------------------------


    //generic clearing function
    function clearLanMap(){
        svg.selectAll(".g-nodes")
            .attr("style", "opacity:1");

        d3.selectAll(".nodes-risks")
            .attr("class","nodes nodes-risks")
            .attr("r", function(d){
                return altNodeSize(d, nodesRadius,0)
            });


        d3.selectAll(".text-risks")
            .attr("class", textClasses.hidden)
            .attr("style", "font-weight: normal");



        //----Sidebar text data clearing--------------------------

        d3.selectAll(".data-area")
            .attr("class","data-area hidden");

        //clearing all sidebar data text
        d3.selectAll(".s-data-text")
            .text("");

        //Drop active category button
        $(".risk-categories ul li").removeClass("active");

        //clear current node
        $(".trends-selected").attr("curid","empty");

    }

    //clear button
    $("#clear-filter").click(function () {
        clearLanMap();

    });

    //clear all on page on blur
    $("#graph-wrapper").click(function (e) {
        if(e.target.id != 'container-graph')
            return;
        clearLanMap();

    });


}//End landscapeMap
//Global functions for maps

//show all label
function highlightLabels() {
    $("#highlight-text").click(function () {

        if ($(this).data("click")) {

            $(this).data("click", false);
            d3.selectAll(".text-risks")
                .attr("class", "text text-risks text-hidden");
            $(this).text("Show labels");

        }
        else {
            $(this).data("click", true);
            d3.selectAll(".text-risks")
                .attr("class", "text text-risks text-visible");
            $(this).text("Hide labels");
        }

    });
}
highlightLabels();

$("#clear-filter").click(function(){
    $("#highlight-text").text("Show labels");
});
//End show all label



//abort event on link
$( ".map-list li a" ).click(function( event ) {
    event.preventDefault();
});


/*function  node size depending on "rank 1-6"
    for R-I and Landscape map
 */
function altNodeSize(d, nodesRadius, gainNodeSize) {

    if (d.rank == 1 ) {
        return d = nodesRadius + 3.2 + gainNodeSize;
    }
    else if (d.rank == 2 ) {
        return d = nodesRadius + 2.6 + gainNodeSize;
    }
    else if (d.rank == 3 ) {
        return d = nodesRadius + 2 + gainNodeSize;
    }
    else if (d.rank == 4 ) {
        return d = nodesRadius + 1.4 + gainNodeSize;
    }
    else if (d.rank == 5 ) {
        return d = nodesRadius + 0.8 + gainNodeSize;
    }
    else if (d.rank == 6 ) {
        return d = nodesRadius + 0.2 + gainNodeSize
    }
    else{
        return d = nodesRadius  + gainNodeSize;
    }

}

/*function  stroke width depending on "rank 1-6"
*   for r-i map
*/
function altStrength(d, strokeWidth, gainStrokeWidth) {

    if (d.source.rank == 1 || d.target.rank == 1 ) {
        return d = strokeWidth + 1.4 + gainStrokeWidth;
    }
    else if (d.source.rank == 2 || d.target.rank == 2) {
        return d = strokeWidth  + 0.6 + gainStrokeWidth;
    }
    else{
        return d = strokeWidth  - 0.2 + gainStrokeWidth;
    }

}

/* *********************************** SIDEBAR ******************************** */
/*Sidebar text data
* General function for all map
*/

function getDataSidebar(riskObj, oneTrend, currentColor,edgesForThree){

    d3.selectAll(".data-area")
        .attr("class","data-area visible");

    //special rules for current map
    d3.select(".risk-data-area")
        .attr("class","risk-data-area visible");


    //type of risk
    d3.selectAll(".trend-risk")
        .text("risk");
    //Nodes label
    d3.selectAll(".trends-selected")
        .data(oneTrend)
        .text(function (d) {
            return d.label || d.id;
        })
        .attr("curID", function(d){
            return d.id;
        });

    //Nodes description
    d3.selectAll(".description-risk")
        .data(oneTrend)
        .text(function (d) {
            return d.description || "No description";
        });
    //Nodes category
    d3.selectAll(".sel-cat")
        .data(oneTrend)
        .text(function (d) {
            return d.category || "No category";
        })
        .attr("style", "color:" + currentColor);

    //Nodes impact
    d3.selectAll(".sel-impact")
        .data(oneTrend)
        .text(function (d) {
            return d.impact || "No impact value";
        });
    //Nodes likelihood
    d3.selectAll(".sel-likelihood")
        .data(oneTrend)
        .text(function (d) {
            return d.likelihood || "No likelihood value";
        });

    partSideMostThree(edgesForThree)

}//end getDataSidebar


/*
* special data sidebar for t-r map (Trends)
*/
function getDataSidebarTrendsMap(oneTrend,currentColor, edgesForThree) {

    d3.selectAll(".data-area")
        .attr("class","data-area visible");

    d3.select(".risk-data-area")
        .attr("class","risk-data-area hidden");

    //type of risk
    d3.selectAll(".trend-risk")
        .text("trend");
    //Nodes label
    d3.selectAll(".trends-selected")
        .data(oneTrend)
        .text(function (d) {
            return d.label || d.id;
        })
        .attr("curID", function(d){
            return d.id;
        });
    //Nodes description
    d3.selectAll(".description-risk")
        .data(oneTrend)
        .text(function (d) {
            return d.description || "No description";
        });
    //Nodes category
    d3.selectAll(".sel-cat")
        .data(oneTrend)
        .text(function (d) {
            return d.category || "No category";
        })
        .attr("style", "color:" + currentColor);

    //clear impact,likelihood
    d3.selectAll(".sel-impact")
        .text("");

    d3.selectAll(".sel-likelihood")
        .text("");


    partSideMostThreeTrends(edgesForThree);


}//getDataSidebarTrendsMap

//function for appending three most connected for Trends
function partSideMostThreeTrends(edgesForThree){
    //append three most connected risks in left sidebar
    if ($("body").attr("class") != 'map landscape-map') {
        $(".most-connected").html("");
        edgesForThree.forEach(function (e, i) {
            //sort to just three nodes
            if (i <= 2) {
                $(".most-connected").append("<li class = 'm-risk' mid='" + e.source.id + "'>" + e.source.label + "</li>");
            }
        });
    }
}

//function for appending three most connected for Nodes
function partSideMostThree(edgesForThree) {
    //append three most connected risks in left sidebar
    if ($("body").attr("class") != 'map landscape-map') {
        $(".most-connected").html("");
        edgesForThree.forEach(function (e, i) {
            //sort to just three nodes
            if (i <= 2) {
                $(".most-connected").append("<li class = 'm-node' mid='" + e.source.id + "'>" + e.source.label + "</li>");
            }
        });
    }
}


//confirm for escape to nav
$(".main-nav .nav a").on("click", function(){

     //checking map template
    if($("body").hasClass("map")){
        var confirmCheck =  confirm("Navigating away will lose the data – do you wish to continue?");
        if(confirmCheck == false){
            event.preventDefault();
        }
    }
});


//snapshot functionality
function addSnapshot(){
    $("#container-graph").find(".text-hidden").css("display","none");
    saveSvgAsPng(document.getElementById("container-graph"), "snap.png",{encoderOptions:1});
    console.log(this);
}

var snapButton =  document.getElementById("snapshot-button");
snapButton.addEventListener("click", addSnapshot, false);
//-----------------------------------------------------------------------------------------