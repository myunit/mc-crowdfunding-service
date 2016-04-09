/**
 * @author QianQing
 * @create by 15-12-30
 * @description common method for app
 */
var utils = function () {

};

/**
 * @description clone 一个对象(主要针对引用类型)
 * @param {object} origin object
 * @result {object} new object
 */
utils.clone = function (origin) {
	if(!origin){
		return;
	}

	var obj = {};
	for(var f in origin){
		if(origin.hasOwnProperty(f)){
			obj[f] = origin[f];
		}
	}

	return obj;
};

/**
 * @description clone 一个对象(主要针对引用类型)
 * @param {String} ip string
 * @result {bool} is ip
 */
utils.isIP =function isIP(ip) {
	var re =  /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
	return re.test(ip);
};

/**
 * @description 将时间按分隔符格式化,精确到秒
 * @param {Date} date: Date Object
 * @param {string} dateSPR: date separator
 * @param {string} timeSPR: time separator
 * @result {string} date time format string
 */
utils.formatBySPR = function (date, dateSPR, timeSPR) {
	if (date === undefined || date === null)
		throw new TypeError('The first must be a Date Object');

	if (dateSPR && typeof dateSPR != 'string')
		throw new TypeError('The separator must be a String Object');

	if (timeSPR && typeof timeSPR != 'string')
		throw new TypeError('The separator must be a String Object');

	dateSPR = dateSPR || '-';
	timeSPR = timeSPR || ':';
	var y = date.getFullYear();
	var M = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();
	M = M < 10 ? '0' + M : M;
	d = d < 10 ? '0' + d : d;
	h = h < 10 ? '0' + h : h;
	m = m < 10 ? '0' + m : m;
	s = s < 10 ? '0' + s : s;
	return y + dateSPR + M + dateSPR + d + " " + h + timeSPR + m + timeSPR + s;
};

utils.formatByT = function (date) {
  var y = date.getFullYear();
  var M = date.getMonth() + 1;
  var d = date.getDate();
  var h = date.getHours();
  var m = date.getMinutes();
  var s = date.getSeconds();
  M = M < 10 ? '0' + M : M;
  d = d < 10 ? '0' + d : d;
  h = h < 10 ? '0' + h : h;
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  return y + '-' + M + '-' + d + "T" + h + ':' + m + ':' + s;
};

/**
 * @description 将时间按分隔符格式化,精确到毫秒
 * @param {Date} date: Date Object
 * @param {string} dateSPR: date separator
 * @param {string} timeSPR: time separator
 * @result {string} date time format string
 */
utils.formatBySPR4MS = function (date, dateSPR, timeSPR) {
	dateSPR = dateSPR || '-';
	timeSPR = timeSPR || ':';
	var y = date.getFullYear();
	var M = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();
	var ms = date.getMilliseconds();
	M = M < 10 ? '0' + M : M;
	d = d < 10 ? '0' + d : d;
	h = h < 10 ? '0' + h : h;
	m = m < 10 ? '0' + m : m;
	s = s < 10 ? '0' + s : s;
	return y + dateSPR + M + dateSPR + d + " " + h + timeSPR + m + timeSPR + s + timeSPR + ms;
};

/**
 * @description 将unicode字符串转换为utf8格式
 * @param {string} str: unicode string
 * @result {string} utf8 string
 */
utils.unicodeToUtf8 = function (str) {
	if (str === undefined || str === null || typeof str != 'string')
		throw new TypeError('The first must be a String Object');

	var i, len, ch;
	var utf8Str = "";
	len = str.length;
	for (i = 0; i < len; i++) {
		ch = str.charCodeAt(i);

		if ((ch >= 0x0) && (ch <= 0x7F)) {
			utf8Str += str.charAt(i);

		} else if ((ch >= 0x80) && (ch <= 0x7FF)) {
			utf8Str += String.fromCharCode(0xc0 | ((ch >> 6) & 0x1F));
			utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

		} else if ((ch >= 0x800) && (ch <= 0xFFFF)) {
			utf8Str += String.fromCharCode(0xe0 | ((ch >> 12) & 0xF));
			utf8Str += String.fromCharCode(0x80 | ((ch >> 6) & 0x3F));
			utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

		} else if ((ch >= 0x10000) && (ch <= 0x1FFFFF)) {
			utf8Str += String.fromCharCode(0xF0 | ((ch >> 18) & 0x7));
			utf8Str += String.fromCharCode(0x80 | ((ch >> 12) & 0x3F));
			utf8Str += String.fromCharCode(0x80 | ((ch >> 6) & 0x3F));
			utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

		} else if ((ch >= 0x200000) && (ch <= 0x3FFFFFF)) {
			utf8Str += String.fromCharCode(0xF8 | ((ch >> 24) & 0x3));
			utf8Str += String.fromCharCode(0x80 | ((ch >> 18) & 0x3F));
			utf8Str += String.fromCharCode(0x80 | ((ch >> 12) & 0x3F));
			utf8Str += String.fromCharCode(0x80 | ((ch >> 6) & 0x3F));
			utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

		} else if ((ch >= 0x4000000) && (ch <= 0x7FFFFFFF)) {
			utf8Str += String.fromCharCode(0xFC | ((ch >> 30) & 0x1));
			utf8Str += String.fromCharCode(0x80 | ((ch >> 24) & 0x3F));
			utf8Str += String.fromCharCode(0x80 | ((ch >> 18) & 0x3F));
			utf8Str += String.fromCharCode(0x80 | ((ch >> 12) & 0x3F));
			utf8Str += String.fromCharCode(0x80 | ((ch >> 6) & 0x3F));
			utf8Str += String.fromCharCode(0x80 | (ch & 0x3F));

		}
	}
	return utf8Str;
};

exports = module.exports = utils;
