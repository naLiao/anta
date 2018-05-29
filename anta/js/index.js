//图片预加载
(function () {
    // loading();
    anmt5();
    setPres();
})();

//阻止橡皮筋效果
document.addEventListener('touchstart', function (e) {
    e.preventDefault();
}, {passive: false});  //passive 参数不能省略，用来兼容ios和android

//计算景深
function setPres() {
    resetView();
    window.onresize = resetView;

    function resetView(ev) {
        const view = document.getElementById('view');
        const main = document.getElementById('main');
        let deg = 52.5;
        let height = document.documentElement.clientHeight;
        let pers = Math.round(Math.tan(deg*Math.PI/180)*height/2);
        view.style.WebkitPerspective = view.style.perspective = pers + 'px';
        css(main,'translateZ',pers);
    }
}

//loading红色logo旋转
function loading() {
    const logoText = document.querySelector('.logoText');
    let imgAll = [];
    let num = 0;

    for(let attr in imgData){
        imgAll = imgAll.concat(imgData[attr]);
    }
    let len = imgAll.length;
    for(let i=0;i<imgAll.length;i++){
        let img = new Image();  //给浏览器缓存图片
        img.src = imgAll[i];
        img.onload = function () {  //缓存完成事件
            num++;
            logoText.innerHTML = '已加载' + Math.floor(num/len*100) + '%';
            if(num==len){  //全部缓存完成时执行
                anmt1();
            }
        }
    }
}

//anmt1:隐藏红色logo，显示橙色logo
function anmt1() {
    const view = document.getElementById('view');
    const logo1 = document.getElementById('logo1');
    let div2 = document.createElement('div');
    let div3 = document.createElement('div');
    div2.id = 'logo2';
    div3.id = 'logo3';
    div2.className = div3.className = 'logoImg';
    let img2 = new Image();
    let img3 = new Image();
    img2.src = imgData.logo[0];
    img3.src = imgData.logo[1];
    div2.appendChild(img2);
    div3.appendChild(img3);
    view.appendChild(div2);
    view.appendChild(div3);  //同时创建logo2和logo3，让旋转能同步
    cssTransform(logo2,'translateZ',-2000);
    cssTransform(logo3,'translateZ',-2000);
    css(logo2,'opacity',0);
    css(logo3,'opacity',0);
    MTween({
        el:logo1,
        target:{opacity:0},
        time:1000,
        type:'easeOut',  //隐藏logo1
        callBack: function () {
            view.removeChild(logo1);  //删除logo1
            css(logo2,'opacity',100);
            MTween({
                el:logo2,
                target:{translateZ:0},
                time:160,
                type:'linear',  //让logo2从后往前
                callBack: anmt2
            })
        }
    })
}

//anmt2：隐藏橙色logo，显示蓝色logo
function anmt2() {
    let logo2 = document.querySelector('#logo2');
    let logo3 = document.querySelector('#logo3');
    setTimeout(function () {  //让logo2停留2秒后执行
        logo2Tologo3();
    },1500);

    function logo2Tologo3() {
        MTween({
            el:logo2,
            target:{translateZ:-2000},
            time:800,
            type:'easeIn',
            callBack: function () {
                view.removeChild(logo2);
                css(logo3,'opacity',100);  //显示蓝色logo
                setTimeout(function (args) {
                    MTween({
                        el:logo3,
                        target:{translateZ:0},
                        time:100,
                        type:'linear',  //让logo3从后往前走
                        callBack:anmt3
                    })
                },500)
            }
        })
    }
}

//隐藏蓝色logo
function anmt3() {
    let logo3 = document.querySelector('#logo3');
    setTimeout(function () {
        MTween({
            el:logo3,
            target:{translateZ:-2000},
            time:800,
            type:'easeIn',
            callBack: function () {
                view.removeChild(logo3);
                anmt4();
            }
        })
    },2000)
}

//显示爆炸效果，隐藏爆炸效果
function anmt4() {
    //生成爆炸logo，内有logo4Img：主logo；logo4Box：内放旋转小图
    let view = document.getElementById('view');
    let logo4 = document.createElement('div');
    let logo4Img = new Image();
    logo4Img.src = imgData.logo[2];
    let logo4Box = document.createElement('div');
    logo4.id = 'logo4';
    logo4Img.id = 'logo4Img';
    logo4Box.id = 'logo4Box';

    //半径随机旋转角度随机的正N边柱
    let iconsLength = 27;  //总共27个小logo
    for(let i=0;i<iconsLength;i++){
        let span = document.createElement('span');

        let degx = Math.round(Math.random()*360);
        let Rx = 20+Math.random()*200;
        let degy = Math.round(Math.random()*360);
        let Ry = 30+(Math.random()-0.5)*340;
        css(span,'rotateY',degx);
        css(span,'translateZ',Rx);
        css(span,'translateY',Ry);
        css(span,'rotateX',degy);

        span.style.backgroundImage = `url(${imgData.logoIco[i%imgData.logoIco.length]})`;
        logo4Box.appendChild(span);
    }

    logo4.append(logo4Img);
    logo4.append(logo4Box);
    view.appendChild(logo4);

    //爆炸logo运动从远到近，再收回
    css(logo4,'translateZ',-2000);
    setTimeout(function () {
        MTween({
            el:logo4,
            target:{translateZ:0},
            time:400,
            type:'easeIn',
            callBack: function () {
                setTimeout(function () {
                    MTween({
                        el:logo4,
                        target:{translateZ:-1000,scale:10},
                        time:700,
                        type:'easeIn',
                        callBack: function () {
                            view.removeChild(logo4);
                            setTimeout(function () {
                                anmt5();
                            },200)
                        }
                    })
                },2000);  //爆炸logo停留时间
            }
        })
    },100)  //爆炸logo等待一会再向前冲
}

//执行动画6、7，整体从远到近
function anmt5() {
    let tZ = document.getElementById('tZ');  //tZ控制整体的Z轴位置
    css(tZ,'translateZ',-2000);
    anmt7();  //2800云朵出场
    anmt6();  //3600圆柱出场
    floatAppear();  //3600漂浮层出场
    MTween({
        el:tZ,
        target:{translateZ:-160},
        time:3600,
        type:'easeBoth'
    });
}

//主体圆柱入场
function anmt6() {
    let bgSpanBox= document.getElementById('bgSpanBox');
    let startDeg = 180;
    let width = 129/2;
    let spanDeg = (180-(360/imgData.bg.length))/2;  //内角
    let R = Math.floor(Math.tan(spanDeg*Math.PI/180)*width)-1;
    css(bgSpanBox,'rotateX',0);  //一般必须先设置X方向再设置y方向，否则X方向会有点偏移
    css(bgSpanBox,'rotateY',-695);  //圆柱初始角度

    //生成20个块拼成一个圆柱
    for(let i=0;i<imgData.bg.length;i++){
        let span = document.createElement('span');
        css(span,'rotateY',startDeg);
        css(span,'translateZ',-R);
        span.style.backgroundImage = 'url('+imgData.bg[i]+')';
        span.style.opacity = 0;
        bgSpanBox.appendChild(span);
        startDeg -= (360/imgData.bg.length);
    }

    //背景一块一块出现
    let num = 0;
    let timer = setInterval(function () {
        bgSpanBox.children[num].style.opacity = 100;
        num++;
        if(num>=bgSpanBox.children.length){
            clearInterval(timer);
        }
    },90)

    //圆柱旋转
    MTween({
        el:bgSpanBox,
        target:{rotateY:25},
        time:3600,
        type:'linear',
        callBack:function(){
            setdrag();
            setTimeout(function () {
                window.isStart = true;
                setSensors();
            },1000)
        }
    })
}

//云朵入场
function anmt7() {
    const cloud = document.getElementById('cloud');
    css(cloud,'translateZ',100);
    css(cloud,'rotateY',0);
    //生成云朵并围成圆柱
    for(let i=0;i<9;i++){
        let span = document.createElement('span');
        span.style.backgroundImage = 'url('+imgData.cloud[i%3]+')';
        cloud.appendChild(span);

        let R = 280+ (Math.random()-0.5)*20;  //云朵围成圆柱的半径
        let deg = 70*i;  //70 = (180-(360/9))/2
        let x = Math.sin(deg*Math.PI/180)*R;
        let z = Math.cos(deg*Math.PI/180)*R;
        let y = (Math.random()-0.5)*380;
        // css(span,'rotateY',deg*i);  //云朵位移到正确位置，但是不旋转，因为旋转会导致云朵非正面对外
        css(span,'translateZ',z);
        css(span,'translateX',x);
        css(span,'translateY',y);
        css(span,'opacity',0);
    }

    //云朵一块一块出现
    let num = 0;
    let timer = setInterval(function () {
        cloud.children[num].style.opacity = 100;
        num++;
        if(num>=cloud.children.length){
            clearInterval(timer);
        }
    },100)

    //云朵旋转
    MTween({
        el:cloud,
        target:{rotateY:540},
        time:2800,
        type:'easeOut',
        callIn:function () {
            let deg = css(cloud,'rotateY');
            for(let i=0;i<cloud.children.length;i++){
                css(cloud.children[i],'rotateY',-deg);  //让云朵同步反方向旋转，始终正面对外
            }
        },
        callBack:function () {
            MTween({
                el:cloud,
                target:{opacity:0},
                time:100,
                type:'easeOut',
                callBack:function () {
                    cloud.parentNode.removeChild(cloud);  //云朵旋转完成后就消失，进入主画面
                    redBgAppear();
                }
            })
        }
    });
}

//左右、上下拖拽圆柱、漂浮层旋转对应角度
function setdrag() {
    let bgSpanBox = document.querySelector('#bgSpanBox');
    let panoBox = document.querySelector('#panoBox');
    let tZ = document.querySelector('#tZ');

    let startZ = -160;
    let origin = {x:0,y:0};
    let originDeg = {x:0,y:0};
    let scale = {x:18/129,y:60/1170};  //一个图片宽129，对应18deg，高1170，对应90
    let lastDegDis = {x:0,y:0};
    let lastDeg = {x:0,y:0};

    bgSpanBox.addEventListener('touchstart',start);
    bgSpanBox.addEventListener('touchmove',move);
    bgSpanBox.addEventListener('touchend',end);

    panoBox.addEventListener('touchstart',start);
    panoBox.addEventListener('touchmove',move);
    panoBox.addEventListener('touchend',end);

    function start(ev) {
        window.isTouch = true;  //开始手指拖拽的时候不让陀螺仪旋转
        clearInterval(bgSpanBox.timer);
        clearInterval(panoBox.timer);
        clearInterval(tZ.timer);
        origin.x = ev.changedTouches[0].pageX;  //初始位置
        origin.y = ev.changedTouches[0].pageY;
        originDeg.x = css(bgSpanBox,'rotateY');  //初始旋转角度
        originDeg.y = css(bgSpanBox,'rotateX');
    }
    function move(ev) {
        let dis = {};
        let nowdeg = {};  //圆柱旋转到的角度
        let nowdeg2 = {};  //漂浮层旋转到的角度
        dis.x = ev.changedTouches[0].pageX - origin.x;  //移动的距离
        dis.y = ev.changedTouches[0].pageY - origin.y;

        nowdeg.x = originDeg.x-dis.x*scale.x;  //水平方向应该旋转到的角度
        nowdeg.y = originDeg.y+dis.y*scale.y;  //竖直方向应该旋转到的角度
        nowdeg2.x = originDeg.x-dis.x*scale.x*0.95;
        nowdeg2.y = originDeg.y+dis.y*scale.y*0.95;

        if(nowdeg.y>45){
            nowdeg.y = 45;
        }else if(nowdeg.y<-45){  //控制y轴移动角度不要太多
            nowdeg.y = -45;
        }
        if(nowdeg2.y>45){
            nowdeg2.y = 45;
        }else if(nowdeg2.y<-45){  //控制y轴移动角度不要太多
            nowdeg2.y = -45;
        }

        lastDegDis.x = nowdeg.x - lastDeg.x;
        lastDegDis.y = nowdeg.y - lastDeg.y;
        lastDeg.x = nowdeg.x;
        lastDeg.y = nowdeg.y;

        css(bgSpanBox,'rotateY',nowdeg.x);
        css(bgSpanBox,'rotateX',nowdeg.y);
        css(panoBox,'rotateY',nowdeg2.x);
        css(panoBox,'rotateX',nowdeg2.y);

        //回弹效果，move时往后移动，移动距离与手指滑动距离相关，左滑右滑都是向后移动，所以减去绝对值
        let zMove = Math.max(Math.abs(dis.x),Math.abs(dis.y));
        if(zMove>200){
            zMove = 200;
        }
        // console.log(zMove);
        css(tZ,'translateZ',startZ-zMove);
    }
    function end(ev) {
        let nowDeg = {x:css(bgSpanBox,'rotateY'),y:css(bgSpanBox,'rotateX')};
        MTween({
            el:tZ,
            target:{translateZ: -160},
            time:200,
            type:'easeOut'
        });
        MTween({
            el:bgSpanBox,
            target:{rotateY:nowDeg.x+lastDegDis.x*10},
            time:800,
            type:'easeOut',
            callBack:function () {
                window.isTouch = false;
                window.isStart = true;
            }
        });
        MTween({
            el:panoBox,
            target:{rotateY:nowDeg.x+lastDegDis.x*10},
            time:800,
            type:'easeOut'
        });
    }
}

//陀螺仪
function setSensors() {
    let bgSpanBox = document.querySelector('#bgSpanBox');
    let panoBox = document.querySelector('#panoBox');

    let startDeg = {};
    let initElDeg = {};
    let lastTime = +new Date;

    // window.isTouch = false;

    window.addEventListener('deviceorientation',function (ev) {
        if(window.isTouch){
            return;
        }
        let x = ev.beta;
        let y = ev.gamma;
        var nowTime = Date.now();
        if(nowTime-lastTime<30){
            return;
        }
        lastTime = nowTime;
        if(window.isStart){
            //start
            initElDeg.x = css(bgSpanBox,'rotateX');
            initElDeg.y = css(bgSpanBox,'rotateY');
            startDeg.x = x;
            startDeg.y = y;
            window.isStart = false;
        }else{
            //move
            let dis = {};
            dis.x = x - startDeg.x;
            dis.y = y -startDeg.y;

            let degTo = {};
            degTo.x = initElDeg.x+dis.x;
            degTo.y = initElDeg.y+dis.y;
            if(degTo.x>45){
                degTo.x = 45;
            }else if(degTo.x<-45){
                degTo.x = -45;
            }
                
            let scale = 129/18;
            let startZ = -160;
            let disXZ = (degTo.x - css(panoBox,'rotateY'))*scale;
            let disYZ = (degTo.y - css(panoBox,'rotateX'))*scale;
            let disZ = Math.max( Math.abs(disXZ) , Math.abs(disYZ) );
            if(disZ>200){
                disZ = 200;
            }
            //陀螺仪的回弹效果
            // MTween({
            //     el:tZ,
            //     target:{
            //         translateZ:-160-disZ
            //     },
            //     time:200,
            //     type:'easeOut',
            //     callBack:function () {
            //         MTween({
            //             el:tZ,
            //             target:{
            //                 translateZ:-160
            //             },
            //             time:300,
            //             type:'easeOut'
            //         })
            //     }
            // });
            MTween({
                el:bgSpanBox,
                target:{
                    rotateX:degTo.x,
                    rotateY:degTo.y
                },
                time:800,
                type:'easeOut'
            });
            MTween({
                el:panoBox,
                target:{
                    rotateX:degTo.x,
                    rotateY:degTo.y
                },
                time:800,
                type:'easeOut'
            });
        }
    })
}

//背景出现
function redBgAppear() {
    const redBg = document.getElementById('redBg');
    MTween({
        el:redBg,
        target:{opacity:100},
        time:1000,
        type:"easeBoth"
    });
}

//漂浮层出现
function floatAppear() {
    const panoBox = document.getElementById('panoBox');

    css(panoBox,'rotateX',0);  //必须设置
    css(panoBox,'rotateY',-180);
    css(panoBox,'scale',0);

    let startDeg = 180;
    let R = 406;
    let num = 0;

    //pano1是一个小圆柱
    creatPano(2,1.564,-163,-9.877,180,344);
    creatPano(3,20.225,278,-14.695,144,326);
    creatPano(4,22.275,192.5,-11.35,90,195);
    creatPano(5,20.225,129,14.695,90,468);
    creatPano(6,-11.35,256,22.275,18,582);
    creatPano(6,-4.54,-13,8.91,18,444);
    creatPano(3,-11,150,-26.877,-118,522);
    creatPano(6,-24.436,60,0,-80,421);

    setTimeout(function () {
        MTween({
            el:panoBox,
            target:{rotateY:25,scale:100},
            time:1200,
            type:'easeBoth'
        })
    },2400)

    function creatPano(count,x,y,z,startDeg,height) {
        let div = document.createElement('div');
        div.className = 'pano';
        css(div,"translateX",x);
        css(div,"translateY",y);
        css(div,"translateZ",z);
        for(let i=0;i<count;i++){
            let span = document.createElement('span');
            span.style.cssText = `height:${height}px; margin-top:${-height/2}px`;
            span.style.background = 'url('+ imgData.pano[num] +')';
            num++;
            css(span,'rotateY',startDeg);
            css(span,'translateZ',-406);
            div.appendChild(span);
            startDeg -= 18;
        }
        panoBox.appendChild(div);
    }
}

