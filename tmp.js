function PointToLineDistance (xx, yy, x1, y1, x2, y2) {

    let ang1, ang2, ang, m;
    
    let result = 0;
    
    // 分别计算三条边的长度
    const a = Math.sqrt((x1 - xx) * (x1 - xx) + (y1 - yy) * (y1 - yy));
    
    if (a === 0) {
        return [0, { x: x1,
        y: y1 }];
    }

    const b = Math.sqrt((x2 - xx) * (x2 - xx) + (y2 - yy) * (y2 - yy));
    
    if (b === 0) {
        return [0, { x: x2,y: y2 }];
    }

    const c = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    
    // 如果线段是一个点则退出函数并返回距离
    if (c === 0) {
    result = a; 
        return [result, { x: x1,
        y: y1 }];
    }
    
    // 如果点(xx,yy到点x1,y1)这条边短
    if (a < b) {

    // 如果直线段AB是水平线。得到直线段AB的弧度
    
    if (y1 === y2) {
    
    if (x1 < x2) {
    
    ang1 = 0;
    
    } else {
    
    ang1 = Math.PI;
    
    }
    
    } else {
    
    m = (x2 - x1) / c;
    
    if (m - 1 > 0.00001) {
    
    m = 1;
    
    }
    
    ang1 = Math.acos(m);
    
    if (y1 > y2) {
    
    ang1 = Math.PI * 2 - ang1;
    
    }// 直线(x1,y1)-(x2,y2)与折X轴正向夹角的弧度
    
    }
    
    m = (xx - x1) / a;
    
    if (m - 1 > 0.00001) {
    
    m = 1;
    
    }
    
    ang2 = Math.acos(m);
    
    if (y1 > yy) {
    
    ang2 = Math.PI * 2 - ang2;
    
    }// 直线(x1,y1)-(xx,yy)与折X轴正向夹角的弧度
    
     
    
    ang = ang2 - ang1;
    
    if (ang < 0) {
    
    ang = -ang;
    
    }
    
     
    
    if (ang > Math.PI) {
    
    ang = Math.PI * 2 - ang;
    
    }
    
    // 如果是钝角则直接返回距离
    
    if (ang > Math.PI / 2) {
    
    return [a, { x: x1,
    
    y: y1 }];
    
    }
    
     
    
    // 返回距离并且求得当前距离所在线段的坐标
    
    if (x1 === x2) {
    
    return [b * Math.sin(ang), { x: x1,
    
    y: yy }];
    
    } else if (y1 === y2) {
    
    return [b * Math.sin(ang), { x: xx,
    
    y: y1 }];
    
    }
    
    // 直线的斜率存在且不为0的情况下
    
    let x = 0,
    
    y = 0;
    
    const k1 = ((y2 - y1) / x2 - x1);
    
    const kk = -1 / k1;
    
    const bb = yy - xx * kk;
    
    const b1 = y2 - x2 * k1;
    
     
    
    x = (b1 - bb) / (kk - k1);
    
    y = kk * x + bb;
    
     
    
    return [a * Math.sin(ang), { x,
    
    y }];
    
    }
    
     
    
    // 如果两个点的纵坐标相同，则直接得到直线斜率的弧度
    
    if (y1 === y2) {
    
    if (x1 < x2) {
    
    ang1 = Math.PI;
    
    } else {
    
    ang1 = 0;
    
    }
    
    } else {
    
    m = (x1 - x2) / c;
    
    if (m - 1 > 0.00001) {
    
    m = 1;
    
    }
    
    ang1 = Math.acos(m);
    
    if (y2 > y1) {
    
    ang1 = Math.PI * 2 - ang1;
    
    }
    
    }
    
    m = (xx - x2) / b;
    
    if (m - 1 > 0.00001) {
    
    m = 1;
    
    }
    
    ang2 = Math.acos(m);// 直线(x2-x1)-(xx,yy)斜率的弧度
    
    if (y2 > yy) {
    
    ang2 = Math.PI * 2 - ang2;
    
    }
    
    ang = ang2 - ang1;
    
    if (ang < 0) {
    
    ang = -ang;
    
    }
    
    if (ang > Math.PI) {
    
    ang = Math.PI * 2 - ang;
    
    }// 交角的大小
    
    // 如果是对角则直接返回距离
    
    if (ang > Math.PI / 2) {
    
    return [b, { x: x2,
    
    y: y2 }];
    
    }
    
     
    
    // 如果是锐角，返回计算得到的距离,并计算出相应的坐标
    
    if (x1 === x2) {
    
    return [b * Math.sin(ang), { x: x1,
    
    y: yy }];
    
    } else if (y1 === y2) {
    
    return [b * Math.sin(ang), { x: xx,
    
    y: y1 }];
    
    }
    
    // 直线的斜率存在且不为0的情况下
    
    let x = 0,
    
    y = 0;
    
    const k1 = ((y2 - y1) / x2 - x1);
    
    const kk = -1 / k1;
    
    const bb = yy - xx * kk;
    
    const b1 = y2 - x2 * k1;
    
     
    
    x = (b1 - bb) / (kk - k1);
    
    y = kk * x + bb;
    
     
    
    return [b * Math.sin(ang), { x,
    
    y }];
    
     
    
    }