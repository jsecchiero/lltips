/// <reference path="typings/browser.d.ts" />
var scrollBar = /** @class */ (function () {
    function scrollBar(container) {
        this.container = container;
        this.zone = 'down';
    }
    scrollBar.prototype.getZone = function () {
        return this.zone;
    };
    scrollBar.prototype.getHeight = function () {
        return this.scrollbarHeight;
    };
    scrollBar.prototype.move = function (zone) {
        this.zone = zone;
    };
    scrollBar.prototype.toggle = function () {
        switch (this.zone) {
            case 'up':
                this.zone = 'down';
                break;
            case 'down':
                this.zone = 'up';
                break;
            default:
                console.log('Parameter not expected');
        }
    };
    scrollBar.prototype.getCurrentLink = function () {
        return this.currentLink;
    };
    scrollBar.prototype.refresh = function () {
        this.contentHeight = $(this.container).outerHeight();
        this.contentWidth = $(this.container).outerWidth();
        this.contentPosY = $(this.container).offset().top;
        this.contentPosX = $(this.container).offset().left;
        this.contentBottom = this.contentPosY + this.contentHeight;
        this.windowPosY = $(document).scrollTop();
        this.windowHeight = $(window).height();
        this.windowBottom = this.windowPosY + this.windowHeight;
        var scrollbarDeltaPosY = undefined;
        var scrollbarDeltaHeight = undefined;
        var llistPosY = undefined;
        var llistPosX = undefined;
        var larticlePosY = undefined;
        var larticlePosX = undefined;
        var rangeTop = this.contentPosY;
        if (this.windowPosY > rangeTop) {
            rangeTop = this.windowPosY;
        }
        var rangeBottom = this.contentBottom;
        if (this.windowBottom < rangeBottom) {
            rangeBottom = this.windowBottom;
        }
        this.scrollbarHeight = (rangeBottom - rangeTop) / 6;
        var scrollWidth = this.contentWidth / 20;
        scrollbarDeltaHeight = (rangeBottom - rangeTop) - this.scrollbarHeight;
        $('#scrollbarDelta').outerHeight(scrollbarDeltaHeight);
        $('#scrollbarDelta').outerWidth(scrollWidth);
        switch (this.zone) {
            case 'up':
                var scrollTextPos = (rangeBottom - rangeTop - this.scrollbarHeight) / 2 + rangeTop + this.scrollbarHeight;
                this.scrollbarPosY = rangeTop;
                scrollbarDeltaPosY = rangeTop + this.scrollbarHeight;
                $('#llist').finish();
                $('#larticle').finish();
                $('#llist').hide();
                $('#larticle').show();
                this.currentLink = $('#larticle');
                break;
            case 'down':
                var scrollTextPos = (rangeBottom - rangeTop - this.scrollbarHeight) / 2 + rangeTop;
                this.scrollbarPosY = rangeBottom - this.scrollbarHeight;
                scrollbarDeltaPosY = rangeTop;
                $('#llist').finish();
                $('#larticle').finish();
                $('#larticle').hide();
                $('#llist').show();
                this.currentLink = $('#llist');
                break;
            default:
                console.log('Parameter not expected');
        }
        $('#scrollbarBase').outerHeight(this.contentHeight);
        $('#scrollbarBase').outerWidth(scrollWidth);
        $('#scrollbarBase').offset({ top: this.contentPosY, left: this.contentPosX });
        $('#scrollbarDelta').offset({ top: scrollbarDeltaPosY, left: this.contentPosX });
        //$('#scrollbarDelta').textfill({ LineHeight: true, maxFontPixels: 30 });
        larticlePosY = scrollTextPos - ($('#larticle').outerHeight() / 2);
        larticlePosX = (scrollWidth - $('#larticle').outerWidth()) / 2 + this.contentPosX;
        llistPosY = scrollTextPos - ($('#llist').outerHeight() / 2);
        llistPosX = (scrollWidth - $('#llist').outerWidth()) / 2 + this.contentPosX;
        $('#larticle').offset({ top: larticlePosY, left: larticlePosX });
        $('#llist').offset({ top: llistPosY, left: llistPosX });
        $('#scrollbar').outerHeight(this.scrollbarHeight);
        $('#scrollbar').outerWidth(scrollWidth);
        $('#scrollbar').offset({ top: this.scrollbarPosY, left: this.contentPosX });
        $('#scrollbar').draggable({ axis: 'y', containment: "parent" });
    };
    return scrollBar;
}());
var terminalScroll = new scrollBar("#terminal");
$(document).ready(function () {
    if ($('#article').length) {
        $("#list").hide();
    }
    terminalScroll.refresh();
    $("#scrollbarBase").click(function () {
        if ($('#article').length) {
            $("#list").toggle();
            $("#article").toggle();
            terminalScroll.toggle();
            terminalScroll.refresh();
        }
    });
    var scrollbarPosYStop = 0;
    var scrollbarPosYStart = 0;
    $("#scrollbar").on("dragstart", function (event, ui) {
        scrollbarPosYStart = $('#scrollbar').offset().top;
    });
    $("#scrollbar").on("dragstop", function (event, ui) {
        scrollbarPosYStop = $('#scrollbar').offset().top;
        var diff = scrollbarPosYStart - scrollbarPosYStop;
        diff = Math.abs(diff);
        if (diff > (terminalScroll.scrollbarHeight / 2) &&
            $('#article').length) {
            terminalScroll.toggle();
            $("#list").toggle();
            $("#article").toggle();
        }
        terminalScroll.refresh();
    });
    // Fade in effect on moving
    var timer;
    var showCommentsLight = 0.6;
    var effectTarget = terminalScroll.getCurrentLink();
    effectTarget.fadeOut({ duration: 0 });
    $(document).on("vmousemove", function (event) {
        effectTarget = terminalScroll.getCurrentLink();
        if (timer) {
            clearTimeout(timer);
            timer = 0;
        }
        effectTarget.finish();
        effectTarget.fadeIn({ duration: 100 });
        $("#showComments").finish();
        $("#showComments").animate({ color: "rgba(255, 255, 255," + showCommentsLight + ")" }, 100);
        timer = setTimeout(function () {
            effectTarget.fadeOut({ duration: 700 });
            $("#showComments").animate({ color: "rgba(255, 255, 255, 0.1)" }, 700);
        }, 400);
    });
    // Light the text in the comments button on hover
    $('#showComments').on("vmouseover", function (event) {
        showCommentsLight = 1;
    });
    $('#showComments').on("vmouseout", function (event) {
        showCommentsLight = 0.6;
    });
    // Light the text in the scrollbar on hover
    $('#scrollbarDelta').on("vmouseover", function (event) {
        $('#scrollbarDelta').css('color', '#FFFFFF');
    });
    $('#scrollbarDelta').on("vmouseout", function (event) {
        $('#scrollbarDelta').css('color', '#727272');
    });
    // Pulse the underscore in the cmd
    var time = setInterval(function () {
        $('#underscore').toggle();
    }, 1000);
    $("#comments").fadeOut();
    $("#showComments").click(function () {
        $(window).resize();
        $("#comments").toggle();
        $("#fakeComments").toggle();
        var str = $("#showComments").text();
        if (str.indexOf("˅") > -1) {
            $("#showComments").html("&#x2C4");
        }
        else {
            $("#showComments").html("&#x2C5");
        }
    });
});
$(window).resize(function () {
    terminalScroll.refresh();
});
$(window).scroll(function () {
    terminalScroll.refresh();
});
$(window).change(function () {
    terminalScroll.refresh();
});
$(window).load(function () {
    terminalScroll.refresh();
});
