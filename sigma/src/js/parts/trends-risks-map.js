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
