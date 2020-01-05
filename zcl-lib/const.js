/**
 * 全局静态变量
 */

// 事件名称
// 鼠标事件
const EventNamesMouse = [
    'click', 
    'contextmenu', 
    'mousemove', 
    'mousedown', 
    'mouseup', 
    'dbclick', 
    'wheel', 
    'mouseover', 
    'focus', 
    'blur',
    'mouseout'
];

// 键盘事件
const EventNamesKeywords = [
    'keydown', 'keypress', 'keyup'
];

// 鼠标+键盘
const EventNames =
    EventNamesMouse.concat(EventNamesKeywords);

// 自定义事件
const EventNamesZcl = [
    'beforeframe', 'afterframe', 'beforeinit', 'afterinit', 'timing'
];