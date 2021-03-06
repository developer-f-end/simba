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



























