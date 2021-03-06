function inicializeMoviment() {

    $(init);

    function init() {
        //Selected Images
        enableDraggable('.draggableTile');

        //Uncompleted tails
        enableDroppable(".uncomplete", dropSprite, '.draggableTile');

        //Trash
        enableDroppable(".trash", goTrash, '.uncomplete');
    }

    function dropSprite(event, ui) {
        //Event target + element
        var target = $(event.target);
        var sampleTarget = $(event.toElement);

        //Change opacity
        opacity(target, 1);
        opacity(sampleTarget, 0);

        //Selected Image
        var selectImage = $(event.toElement).data("sprite");
        console.log("SELECT IMAGE - " + selectImage);

        //Position in table
        var positionTable = target.data('position');
        console.log("POSITION TABLE - " + positionTable);

        //PositionLine
        var positionLine = target.data("line");
        console.log("POSITION LINE - " + positionLine);

        //Change Sprite
        changeSprite(target, selectImage, 0);

        //Change values - newArray
        completeSudoku(positionLine, positionTable, selectImage);

        //Active 'draggable' when change image
        enableDraggable(target);
        $(event.target).draggable('enable');

        //Check correct sudoku

        //checkSUdoku();
        var total = 0

        $.each(unCompleteArray, function (index, obj) {
            $.each(obj, function (key, value) {
                //console.log(key);
                //console.log(value);

                if (value != 0) {
                    total++;
                }
            });
        });

        if (total == 16) {
            checkSudoku()
        }

        //Disable 'draggable' from uncomplete tails
        disableDroppable(event.target);

        //Change opacity
        opacity(sampleTarget, 1);
    }

    function goTrash(event, ui) {
        //Event
        var target = $(event.toElement);
        var back = $('.back' + target.data('position'));

        //Change Sprite
        changeSprite(back, '_null', 0);
        opacity(target, 0);

        //Position in table
        var positionTable = target.data('position');

        //PositionLine
        var positionLine = target.data("line");

        //Change values - uncompleteArray
        completeSudoku(positionLine, positionTable, 0);

        //Disable 'draggable' from uncomplete tails
        target.draggable("disable");

        //Enable 'droppable' again
        $('.uncomplete').droppable("enable");
        enableDroppable(".uncomplete", dropSprite, '.draggableTile');
    }

    function checkSudoku() {
        if (unCompleteArray.join() == completeArray.join()) {
            endGame(true);
            $(".buttons").fadeTo("slow", 1)

            //alert("SUdoku OKEY");
        } else {
            for (var x = 0; x < 4; x++) {
                unCompleteArray[x].forEach(function (number, index) {

                    if (number != completeArray[x][index]) {
                        
                        //Change values of sudoku
                        completeSudoku(x, index, 0);

                        var position = $("[data-position='" + index + "'][data-line='" + x + "']")
                            .addClass('incorrect');

                        //Change Sprite & draggable - droppable
                        changeSprite(position, '_null', 3000);

                        setTimeout(function () {
                            position.removeClass('incorrect')

                            //Dissable draggable
                            position.draggable("disable")

                            //Enable droppable
                            $('.uncomplete').droppable("enable");
                            enableDroppable(".uncomplete", dropSprite, '.draggableTile');
                        }, 3000);

                    }
                });
            }
        };
    }
}

/* AUXILIARS FUNCTIONS */
function enableDraggable(divEnable) {
    //Selected Images
    $(divEnable).draggable({
        start: function (event, ui) {
            $(event.target).css("z-index", 100)
                .css({
                    "border-color": "black",
                    "border-width": "2px",
                    "border-style": "solid"
                });
        },
        stop: function (event, ui) {
            $(event.target).css("z-index", 0)
                .css({
                    "border-color": "",
                    "border-width": "",
                    "border-style": ""
                });
        },
        revert: true,
        revertDuration: 0,
        containment: 'body',
        snap: '.menu'
    });
}

function enableDroppable(divEnable, typeDrop, typeAccept) {
    $(divEnable).droppable({
        drop: typeDrop,
        accept: typeAccept
    });
}

function disableDroppable(divDisable) {
    $(divDisable).droppable('disable');
}

function changeSprite(element, image, time) {
    setTimeout(function () {
        element.css("background-image", "url(img/" + urlImages + "/image" + image + ".png)");
    }, time);
}

function completeSudoku(positionLine, positionTable, selectImage) {
    unCompleteArray[positionLine][positionTable] = selectImage;
}