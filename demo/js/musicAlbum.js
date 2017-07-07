; (function ($) {
    //限于背景效果，暂时要求容器media尺寸不小于600*626px
    var Album = function (mediaDiv) {
        // var self = this;//以防在函数中遇到另外的函数或方法时this指向发生变化时取不到本对象，本插件中没有用到
        this.setting = {
            preload: "true",
            loop: "loop",
            autoplay: "false",
            CDpattern:"true"
        };
        this.media = mediaDiv;
        this.audio = mediaDiv.find("audio");
        //扩展setting对象的内容，当用户设置了对应项是进行覆盖并修改setting的内容
        $.extend(this.setting,this.getSetting());
        this.renderDom();
        this.bindEvents();
    };

    Album.prototype = {

        //audio.duration值为秒数，需制造一个方法将其转化为时间格式
        timeToStr: function (time) {
            var m = 0,
                s = 0,
                _m = '00',
                _s = '00';
            time = Math.floor(time % 3600);
            m = Math.floor(time / 60);
            s = Math.floor(time % 60);
            _s = s < 10 ? '0' + s : s + '';
            _m = m < 10 ? '0' + m : m + '';
            return _m + ":" + _s;
        },
        //为dom中的元素绑定事件
        bindEvents: function () {
            var audio = this.audio[0];
            var timeToStr = this.timeToStr;
            var t = setInterval(function () {
                var currentTime = parseInt(audio.currentTime);
                var duration = parseInt(audio.duration);
                $(".range").attr({ 'max': duration });
                $('.max').text((duration - currentTime) < 1 ? (timeToStr(0)) : timeToStr(duration - currentTime));
                $(".range").val(currentTime);
                $('.cur').text(timeToStr(currentTime));
            }, 1000);
            //触发播放暂停事件   
            $('.play').on('click', function (e) {
                if (audio.paused) {
                    audio.play();
                  console.log(!$(e.target).hasClass("CDpattern"));
                    if(!$(e.target).hasClass("CDpattern")){
                        $(this).css("background","url('../images/pause.png') no-repeat");
                    }else{
                        $("div.cd,div.music").addClass("rotate");
                        $(".cd").css("display", "block");
                    }
                } else {
                    audio.pause();
                   console.log(!$(e.target).hasClass("CDpattern"));
                   
                    if(!$(this).hasClass("CDpattern")){
                    $(this).css("background","url('../images/play.png') no-repeat")
                    }else{
                        $("div.cd,div.music").removeClass("rotate");
                        $(".cd").css("display", "none");
                    }
                }
            });
            //监听滑块，拖动以设置当下播放位置  
            $(".range").on('change', function () {
                audio.currentTime = this.value;
                $(".range").val(this.value);
            });

            $(".cd").on("click", function () {
                $(".play").trigger("click");
            });
            $("#code").click(function(){
                window.open('https://github.com/zhangyan123/study-log/tree/master/%E5%9F%BA%E4%BA%8EH5-audio%E6%A8%A1%E6%8B%9F%E5%85%89%E7%9B%98%E6%92%AD%E6%94%BE%E6%8F%92%E4%BB%B6');
            });
            $("#mute").click(function () {
                if (audio.muted) {
                    $(this).css("background", "url('../images/toMute.png') no-repeat");
                    audio.muted = false;
                } else {
                    $(this).css("background", "url('../images/muted.png') no-repeat");
                    audio.muted = true;
                }
            });
            $("#upVol").click(function () {
                audio.volume = (audio.volume + 0.1) > 0.9 ? 1 : (audio.volume + 0.1);
            });
            $("#downVol").click(function () {
                audio.volume = (audio.volume - 0.1) < .1 ? 0 : (audio.volume - 0.1);
            });

        },
        //获取用户传输的设置参数，注意参数对象需为严格的JSON对象
        getSetting: function () {
            var setting = this.media.attr("data-setting");
            if (setting && setting != "") {
                return $.parseJSON(setting);
            } else {
                return {};
            };
        },
        //渲染插件的结构
        renderDom: function () {
            var setting = this.setting;
            var dom =
                "<span class='play CDpattern'></span><span class='cur'>00:00</span><input type='range' min=0 max=100 class='range' value=0>" +
                "<span class='max'>00:00</span>" +
                "<div class='soundCtrl'>" +
                "<span id='mute'></span>" +
                "<input type='button' value='-' id='downVol' />音量<input type='button' value='+' id='upVol'>" +
                "<button id='code'>获取源码</button>" +
                "</div>" +
                "<div class='cd-container'>" +
                "<div class='cd'></div>" +
                "<div class='music'></div>" +
                "</div>";
            if(setting.CDpattern==="false"){
                dom =
                "<span class='play'></span><span class='cur'>00:00</span><input type='range' min=0 max=100 class='range' value=0>" +
                "<span class='max'>00:00</span>" +
                "<div class='soundCtrl'>" +
                "<span id='mute'></span>" +
                "<input type='button' value='-' id='downVol' />音量<input type='button' value='+' id='upVol'>" +
                "<button id='code'>获取源码</button>" +
                "</div>";
            }
            this.media.append($(dom));
            this.audio.attr({
                "preload": setting.preload,
                "loop": setting.loop,
            });
            if(setting.autoplay==="false"){
                this.audio.removeAttr("autoplay");
                this.audio[0].pause();
                $("div.cd,div.music").removeClass("rotate");
                $(".cd").hide();
            }else{
                if(setting.CDpattern==="false"){
                    $(".play").css("background","url('../images/pause.png') no-repeat");
                }else{
                   $("div.cd,div.music").addClass("rotate");
                   $(".cd").show();
                }
               
            }
            
        }

    };
    Album.init = function (mediaDvis) {
        var album = this;
        mediaDvis.each(function () {
            new album($(this));
        });
    };
    window["Album"] = Album;
})(jQuery);
