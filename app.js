document.addEventListener("DOMContentLoaded", function(event) {

    var playerCar = $("#playerCar");
    var road = $("#road");
    var windowHeight = $(window).height();
    var roadWidth = road.width();
    var lineWidth = roadWidth / 7;
    var carPosition = 3;
    var level = 5;
    var cars = 0;
    var score = 0;
    var canTurn = true;
    var offset = lineWidth;
    var randomCarPosition;
    var pos = playerCar.position();
    var currentCars = [];
    var playerCarHeight = playerCar.css("height");
    var turnLeftButton = $("#turnLeft");
    var turnRightButton = $("#turnRight");
    $(".bcgMusic")[0].volume = 0.3;
    var topTenArray = [];

    var carAnimationDuration = 6;
    var carSpeed = ((carAnimationDuration / (windowHeight / parseInt(playerCarHeight))) * 1100).toFixed(0);


    var imagesArray = [
        "/Ambulance.png",
        "/Black_viper.png",
        "/Mini_truck.png",
        "/Mini_van.png",
        "/Police.png",
        "/truck.png",
        "/Car.png",
        "/taxi.png",
        "/Ambulance.png",
    ];

    var isLineFree = [
        true,
        true,
        true,
        true,
        true,
        true
    ];

    setInterval(collision, 100);

    if (window.innerHeight > window.innerWidth) {
        function setLevel() {
            console.log("score :  " + score);

            if (score <= 30 && score % 6 == 0) {
                level++;
                console.log("score :  " + score);
            } else if (score <= 100 && score % 30 == 0) {
                level++;


            } else if (score <= 300 && score % 100 == 0) {
                level++;
                console.log(score);

            } else if (score > 300 && score % 200 == 0) {
                level++;
                console.log(score);

            }
        }
    } else {
        level = 4;

        function setLevel() {
            console.log("score :  " + score);

            if (score <= 30 && score % 15 == 0) {
                level++;
                console.log("score :  " + score);
            } else if (score <= 100 && score % 35 == 0) {
                level++;


            } else if (score <= 300 && score % 150 == 0) {
                level++;
                console.log(score);

            } else if (score > 300 && score % 250 == 0) {
                level++;
                console.log(score);

            }
        }
    }




    function clearLine(lineNumber) {
        setTimeout(function() {
            //licze czas wczesniej - łapie wh i obliczam ile czasu zajmie zjechanie jednego samochodu - podstawiam pod timeout na koncu tej funkcji.
            isLineFree[lineNumber] = true;
        }, carSpeed)
    }

    function collision() {

        for (var i = 0; i < currentCars.length; i++) {
            if (currentCars[i].data("line") == carPosition) {
                var playerCarOffset = playerCar.offset().top;

                if ((currentCars[i].offset().top + parseInt(playerCarHeight) >= parseInt(playerCarOffset) * 0.99) && (currentCars[i].offset().top - parseInt(playerCarHeight) <= 0.92 * playerCarOffset)) {
                    console.log("Ło kierwa działa!!!");
                    var crashSound = $(".crashSound")[0];
                    crashSound.volume = 1;
                    crashSound.play();
                    $("#road").css("animation", "none");
                    currentCars = [];
                    $("#gameBody").fadeOut("slow");
                    $("#scoreToAdd").html(score * 10);
                    $(".gameOver").fadeIn("slow");
                    setTimeout(function() {
                        $(".gameOver").fadeOut("slow");
                    }, 1600);
                    setTimeout(function() {
                        $(".yourScore").css("display", "flex");
                    }, 2100);
                    // $(document).ready(function() {
                    //     var audioElement = document.createElement('audio');
                    //     audioElement.setAttribute('src', '../sounds/crash.mp3');
                    //     audioElement.addEventListener('ended', function() {
                    //         this.play();
                    //     }, true);
                    // });
                }
            }
        }
    };

    // $("body").bind("touchend", function(e) {
    //   e.preventDefault();
    //   // Add your code here.
    //   $(this).click();
    //   // This line still calls the standard click event, in case the user needs to interact with the element that is being clicked on, but still avoids zooming in cases of double clicking.
    // })

    turnLeftButton.on("touchstart", function(event) {
        var offset = lineWidth;
        var pos = playerCar.position();
        // $(this).children.stopPropagation();

        if (canTurn === true) {
            canTurn = false;
            if (carPosition != 0) {
                setTimeout(turnPossible, 400);
                leftTurn();
                setTimeout(forward, 330);
                playerCar.css("left", pos.left - offset);
                carPosition--;

            } else if (carPosition === 0) {
                turnPossible();
            }
        }
    });

    turnRightButton.on("touchstart", function(event) {
        var offset = lineWidth;
        var pos = playerCar.position();
        // $(this).children.stopPropagation();

        if (canTurn === true) {
            canTurn = false;
            if (carPosition < 5) {
                setTimeout(turnPossible, 400);
                playerCar.css("left", pos.left + offset);
                rightTurn();
                setTimeout(forward, 330);
                carPosition++;
            } else if (carPosition === 5) {
                turnPossible();
            }
        }
    });

    document.addEventListener("keydown", function turns(event) {
        var offset = lineWidth;
        var pos = playerCar.position();
        if (canTurn === true && event.keyCode == "39") {
            canTurn = false;
            if (carPosition < 5) {
                setTimeout(turnPossible, 400);
                playerCar.css("left", pos.left + offset);
                rightTurn();
                setTimeout(forward, 330);
                carPosition++;
            } else if (carPosition === 5) {
                turnPossible();
            }
        } else if (canTurn === true && event.keyCode == "37") {
            canTurn = false;
            if (carPosition != 0) {
                setTimeout(turnPossible, 400);
                leftTurn();
                setTimeout(forward, 330);
                playerCar.css("left", pos.left - offset);
                carPosition--;

            } else if (carPosition === 0) {
                turnPossible();
            }
        }
    });

    function gameEngine() {
        randomCar();
        recycleCars();
    };

    function divGenerator(line) {
        return $("<div class='generatedCar animateCar' data-line='" + line + "' ></div>");
    };
    // var randomLinePosition = Math.floor(Math.random() * 6) + 0;
    // function lineChecking () {
    //     var randomLinePosition = Math.floor(Math.random() * 6) + 0;
    //     if (isLineFree[randomLinePosition][0]) {
    //         isLineFree[randomLinePosition][0] = false;
    //         return randomLinePosition;
    //     }
    //     else {
    //         lineChecking();
    //     }
    // }
    //
    // function freeLine () {
    //
    // }


    function randomCar() {
        if (cars < level) {
            var randomLinePosition = Math.floor(Math.random() * 6) + 0;
            if (isLineFree[randomLinePosition]) {
                var randomBackground = Math.floor(Math.random() * 9) + 0;
                // var randomLinePosition = lineChecking();

                var newCar = divGenerator(randomLinePosition);
                newCar.css("background-image", "url(./img" + imagesArray[randomBackground] + ")");
                newCar.css("left", ($(window).width() * 0.067 + (offset * randomLinePosition)));
                road.append(newCar);
                currentCars.push(newCar);
                cars++;
                isLineFree[randomLinePosition] = false;
                clearLine(randomLinePosition);
            } else {
                randomCar();
            }

        }

    };

    function recycleCars() {
        var allCars = $(".generatedCar");
        var currentRoad = $("#road");
        var wH = $(window).height();

        function recycleAgain() {

            var randomLinePosition = Math.floor(Math.random() * 6) + 0;
            var randomBackground = Math.floor(Math.random() * 9) + 0;
            if (isLineFree[randomLinePosition]) {
                var random = Math.floor(Math.random() * 6) + 0;

                var myCar = currentRoad.find(".generatedCar:nth-child(" + (i + 1) + ")");
                myCar.removeClass("animateCar");
                myCar.css("background-image", "url(./img" + imagesArray[randomBackground] + ")")
                    .css("left", ($(window).width() * 0.067 + (offset * randomLinePosition)));
                // .css({"transform":"translate(88.373263.79910714285717,0)"})
                myCar.addClass("animateCar")
                    .data("line", randomLinePosition);
                score++;
                setLevel();
                console.log(level);
                $("#playerScore span").html(score * 10);
                isLineFree[randomLinePosition] = false;
                clearLine(randomLinePosition);
            } else {
                recycleAgain();
            }




        }
        // console.log("wH value : " + wH);

        for (var i = 0; i < currentCars.length; i++) {
            // console.log($(allCars[i]).css("top"));
            if ($(allCars[i]).css("top").slice(0, -2) > wH) {

                recycleAgain();
                // console.log("Działa");
                // var randomBackground = lineChecking();

                // console.log(randomLinePosition);

                // currentRoad.find(".generatedCar:nth-child("+(i+1)+")")
                //     .removeClass("animateCar")
                //     .css("background-image", "url(./img" + imagesArray[randomBackground] + ")")
                //     .css("left", ($(window).width() * 0.067 + (offset * randomLinePosition)))
                //     // .css({"transform":"translate(88.373263.79910714285717,0)"})
                //     .addClass("animateCar")
                //     .data("line", randomLinePosition);


            }
        }
    }

    function turnPossible() {
        canTurn = true;
    };

    function leftTurn() {
        playerCar.removeClass("turnRight");
        playerCar.addClass("turnLeft");
    };

    function rightTurn() {
        playerCar.removeClass("turnLeft");
        playerCar.addClass("turnRight");
    };

    function forward() {
        playerCar.removeClass("turnLeft");
        playerCar.removeClass("turnRight")
        playerCar.addClass("Forward");
    };

    var startBtn = $("#startBtn");
    var menuSection = $("#menu");
    var gameBody = $("#gameBody");

    startBtn.on("click", function() {
        menuSection.addClass("hidden");
        gameBody.css("visibility", "visible");
        console.log("dupa");
        var carGeneratorInterval = setInterval(gameEngine, 800);
    });

    var addScoreBtn = $("#addScoreBtn");

    addScoreBtn.one("click", function(event) {
        event.preventDefault();
        var userNameInputValue = $("#nameInput").val();
        console.log(userNameInputValue);

        firebase.database().ref().push({
            userName: userNameInputValue,
            score: score * 10
        }, function() {
            var topScores = firebase.database().ref().orderByChild('score').limitToLast(10).on('value', function(fbdata) {
                var myDatabaseObject = fbdata.exportVal();

                var keys = Object.keys(myDatabaseObject);

                var myResults = [];

                keys.forEach(function(key) {
                    var data = myDatabaseObject[key]
                    myResults.push(data);

                });

                var sortedObjectsArray = myResults.sort(function(a, b) {
                    return b.score - a.score
                });
                console.log(myResults.sort(function(a, b) {
                    return b.score - a.score
                }));
                $("#gameOverSection").fadeOut("slow");
                setTimeout(function() {
                    $("#topTenSection").removeClass("hidden").fadeIn("slow").css("display", "flex");
                }, 800);
                // $("#topTenScores").append("<li><h2>" + cos.userName + "  :  " + cos.score + "</h2></li>");
                // console.log(cos.userName, cos.score);
                // topTenArray.push(fbdata.exportVal());
                $("#gameOverSection").fadeOut("slow");
                setTimeout(function() {
                    $("#topTenSection").removeClass("hidden").fadeIn("slow").css("display", "flex");
                }, 800);

                // console.log(topTenArray);
                for (var i = 0; i < sortedObjectsArray.length; i++) {

                    $("#topTenScores").append("<li><h2><span>" + (i + 1) + "</span>.     " + sortedObjectsArray[i].userName + "  :  " + sortedObjectsArray[i].score + "</h2></li>");
                }
            });
        });
    });
});
