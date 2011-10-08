Crypto = {
	/* hex output format. 0 - lowercase; 1 - uppercase */
	hexcase: 0,
	
	/* base-64 pad character. "=" for strict RFC compliance */
	b64pad: "=",
	
	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS 180-1
	 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */
	SHA1: {
		/*
		 * These are the functions you'll usually want to call
		 * They take string arguments and return either hex or base-64 encoded strings
		 */
		hex_sha1: function(s) {
			return Crypto.rstr2hex(Crypto.SHA1.rstr_sha1(Crypto.str2rstr_utf8(s)));
		},
		
		b64_sha1: function(s) {
			return Crypto.rstr2b64(Crypto.SHA1.rstr_sha1(Crypto.str2rstr_utf8(s)));
		},
		
		any_sha1: function(s, e) {
			return Crypto.rstr2any(Crypto.SHA1.rstr_sha1(Crypto.str2rstr_utf8(s)), e);
		},
		
		hex_hmac_sha1: function(k, d) {
			return Crypto.rstr2hex(Crypto.SHA1.rstr_hmac_sha1(Crypto.str2rstr_utf8(k), Crypto.str2rstr_utf8(d)));
		},
		
		b64_hmac_sha1: function(k, d) {
			return Crypto.rstr2b64(Crypto.SHA1.rstr_hmac_sha1(Crypto.str2rstr_utf8(k), Crypto.str2rstr_utf8(d)));
		},
		
		any_hmac_sha1: function(k, d, e) {
			return Crypto.rstr2any(Crypto.SHA1.rstr_hmac_sha1(Crypto.str2rstr_utf8(k), Crypto.str2rstr_utf8(d)), e);
		},
		
		/*
		 * Calculate the SHA1 of a raw string
		 */
		rstr_sha1: function(s) {
			return Crypto.binb2rstr(Crypto.SHA1.binb_sha1(Crypto.rstr2binb(s), s.length * 8));
		},

		/*
		 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
		 */
		rstr_hmac_sha1: function(key, data) {
			var bkey = Crypto.rstr2binb(key);
			
			if(bkey.length > 16) {
				bkey = Crypto.SHA1.binb_sha1(bkey, key.length * 8);
			}
			
			var ipad = Array(16), opad = Array(16);
			
			for(var i = 0; i < 16; i++) {
				ipad[i] = bkey[i] ^ 0x36363636;
				opad[i] = bkey[i] ^ 0x5C5C5C5C;
			}
			
			var hash = Crypto.SHA1.binb_sha1(ipad.concat(Crypto.rstr2binb(data)), 512 + data.length * 8);
			
			return Crypto.binb2rstr(Crypto.SHA1.binb_sha1(opad.concat(hash), 512 + 160));
		},
		
		
		
		/*
		 * Calculate the SHA-1 of an array of big-endian words, and a bit length
		 */
		binb_sha1: function(x, len) {
			/* append padding */
			x[len >> 5] |= 0x80 << (24 - len % 32);
			x[((len + 64 >> 9) << 4) + 15] = len;
			
			var w = Array(80);
			var a =			1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d =			271733878;
			var e = -1009589776;
		
			for(var i = 0; i < x.length; i += 16) {
				var olda = a;
				var oldb = b;
				var oldc = c;
				var oldd = d;
				var olde = e;
				
				for(var j = 0; j < 80; j++) {
					if(j < 16) {
						w[j] = x[i + j];
					} else {
						w[j] = Crypto.bit_rol(w[j-3] ^ w[j-8] ^ w[j-14] ^ w[j-16], 1);
					}
					
					var t = Crypto.safe_add(Crypto.safe_add(Crypto.bit_rol(a, 5), Crypto.SHA1.sha1_ft(j, b, c, d)), Crypto.safe_add(Crypto.safe_add(e, w[j]), Crypto.SHA1.sha1_kt(j)));
					e = d;
					d = c;
					c = Crypto.bit_rol(b, 30);
					b = a;
					a = t;
				}
				
				a = Crypto.safe_add(a, olda);
				b = Crypto.safe_add(b, oldb);
				c = Crypto.safe_add(c, oldc);
				d = Crypto.safe_add(d, oldd);
				e = Crypto.safe_add(e, olde);
			}
			
			return Array(a, b, c, d, e);
		},
		
		/*
		 * Perform the appropriate triplet combination function for the current
		 * iteration
		 */
		sha1_ft: function(t, b, c, d) {
			if(t < 20) {
				return (b & c) | ((~b) & d);
			}
			
			if(t < 40) {
				return b ^ c ^ d;
			}
			
			if(t < 60) {
				return (b & c) | (b & d) | (c & d);
			}
			
			return b ^ c ^ d;
		},
		
		/*
		 * Determine the appropriate additive constant for the current iteration
		 */
		sha1_kt: function(t) {
			return (t < 20) ?			1518500249 : (t < 40) ?			1859775393 :
												 (t < 60) ? -1894007588 : -899497514;
		}
	},
	
	/*
	 * Bitwise rotate a 32-bit number to the left.
	 */
	bit_rol: function(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	},
	
	/*
	 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
	 * to work around bugs in some JS interpreters.
	 */
	safe_add: function(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		
		return (msw << 16) | (lsw & 0xFFFF);
	},
	
	/*
	 * Convert a raw string to a hex string
	 */
	rstr2hex: function(input) {
		var hex_tab = Crypto.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var output = "";
		var x;
		
		for(var i = 0; i < input.length; i++) {
			x = input.charCodeAt(i);
			output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt( x & 0x0F);
		}
		
		return output;
	},
	
	/*
	 * Convert a raw string to a base-64 string
	 */
	rstr2b64: function(input) {
		var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var output = "";
		var len = input.length;
		
		for(var i = 0; i < len; i += 3) {
			var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i+2) : 0);
			
			for(var j = 0; j < 4; j++) {
				if(i * 8 + j * 6 > input.length * 8) {
					output += Crypto.b64pad;
				} else {
					output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
				}
			}
		}
		
		return output;
	},
	
	/*
	 * Convert a raw string to an arbitrary string encoding
	 */
	rstr2any: function(input, encoding) {
		var divisor = encoding.length;
		var remainders = Array();
		var i, q, x, quotient;
		
		/* Convert to an array of 16-bit big-endian values, forming the dividend */
		var dividend = Array(Math.ceil(input.length / 2));
		
		for(i = 0; i < dividend.length; i++) {
			dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
		}

		/*
		 * Repeatedly perform a long division. The binary array forms the dividend,
		 * the length of the encoding is the divisor. Once computed, the quotient
		 * forms the dividend for the next step. We stop when the dividend is zero.
		 * All remainders are stored for later use.
		 */
		while(dividend.length > 0) {
			quotient = Array();
			x = 0;
			
			for(i = 0; i < dividend.length; i++) {
				x = (x << 16) + dividend[i];
				q = Math.floor(x / divisor);
				x -= q * divisor;
				
				if(quotient.length > 0 || q > 0) {
					quotient[quotient.length] = q;
				}
			}
		
			remainders[remainders.length] = x;
			dividend = quotient;
		}
		
		/* Convert the remainders to the output string */
		var output = "";
		
		for(i = remainders.length - 1; i >= 0; i--) {
			output += encoding.charAt(remainders[i]);
		}
		
		/* Append leading zero equivalents */
		var full_length = Math.ceil(input.length * 8 / 
			(Math.log(encoding.length) / Math.log(2)))
		
		for(i = output.length; i < full_length; i++) {
			output = encoding[0] + output;
		}
		
		return output;
	},
	
	/*
	 * Encode a string as utf-8.
	 * For efficiency, this assumes the input is valid utf-16.
	 */
	str2rstr_utf8: function(input) {
		var output = "";
		var i = -1;
		var x, y;
		
		while(++i < input.length) {
			/* Decode utf-16 surrogate pairs */
			x = input.charCodeAt(i);
			y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
			
			if(0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
				x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
				i++;
			}
			
			/* Encode output as utf-8 */
			if(x <= 0x7F) {
				output += String.fromCharCode(x);
			} else if(x <= 0x7FF) {
				output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F), 0x80 | ( x & 0x3F));
			} else if(x <= 0xFFFF) {
				output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
									0x80 | ((x >>> 6 ) & 0x3F),
									0x80 | ( x												 & 0x3F));
			} else if(x <= 0x1FFFFF) {
				output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
									0x80 | ((x >>> 12) & 0x3F),
									0x80 | ((x >>> 6 ) & 0x3F),
									0x80 | ( x												 & 0x3F));
			}
		}
		
		return output;
	},
	
	/*
	 * Encode a string as utf-16
	 */
	str2rstr_utf16le: function(input) {
		var output = "";
		
		for(var i = 0; i < input.length; i++) {
			output += String.fromCharCode( input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
		}
		
		return output;
	},
	
	str2rstr_utf16be: function(input) {
		var output = "";
		
		for(var i = 0; i < input.length; i++) {
			output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
		}
		
		return output;
	},
	
	/*
	 * Convert a raw string to an array of big-endian words
	 * Characters >255 have their high-byte silently ignored.
	 */
	rstr2binb: function(input) {
		var output = Array(input.length >> 2);
		
		for(var i = 0; i < output.length; i++) {
			output[i] = 0;
		}
		
		for(var i = 0; i < input.length * 8; i += 8) {
			output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
		}
		
		return output;
	},
	
	/*
	 * Convert an array of big-endian words to a string
	 */
	binb2rstr: function(input) {
		var output = "";
		
		for(var i = 0; i < input.length * 32; i += 8) {
			output += String.fromCharCode((input[i>>5] >>> (24 - i % 32)) & 0xFF);
		}
		
		return output;
	},
	
	/*
	 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
	 * Digest Algorithm, as defined in RFC 1321.
	 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for more info.
	 */
	MD5: {
		/*
		 * These are the functions you'll usually want to call
		 * They take string arguments and return either hex or base-64 encoded strings
		 */
		hex_md5: function(s) {
			return Crypto.rstr2hex(Crypto.MD5.rstr_md5(Crypto.str2rstr_utf8(s)));
		},
		
		b64_md5: function(s) {
			return Crypto.rstr2b64(Crypto.MD5.rstr_md5(Crypto.str2rstr_utf8(s)));
		},
		
		any_md5: function(s, e) {
			return Crypto.rstr2any(Crypto.MD5.rstr_md5(Crypto.str2rstr_utf8(s)), e);
		},
		
		hex_hmac_md5: function(k, d) {
			return Crypto.rstr2hex(Crypto.MD5.rstr_hmac_md5(Crypto.str2rstr_utf8(k), Crypto.str2rstr_utf8(d)));
		},
					
		b64_hmac_md5: function(k, d) {
			return Crypto.rstr2b64(Crypto.MD5.rstr_hmac_md5(Crypto.str2rstr_utf8(k), Crypto.str2rstr_utf8(d)));
		},
					
		any_hmac_md5: function(k, d, e) {
			return Crypto.rstr2any(Crypto.MD5.rstr_hmac_md5(Crypto.str2rstr_utf8(k), Crypto.str2rstr_utf8(d)), e);
		},
		
		/*
		 * Calculate the MD5 of a raw string
		 */
		rstr_md5: function(s) {
			return Crypto.MD5.binl2rstr(Crypto.MD5.binl_md5(Crypto.MD5.rstr2binl(s), s.length * 8));
		},
		
		/*
		 * Calculate the HMAC-MD5, of a key and some data (raw strings)
		 */
		rstr_hmac_md5: function(key, data) {
			var bkey = Crypto.MD5.rstr2binl(key);
			
			if(bkey.length > 16) {
				bkey = Crypto.MD5.binl_md5(bkey, key.length * 8);
			}
			
			var ipad = Array(16), opad = Array(16);
			
			for(var i = 0; i < 16; i++) {
				ipad[i] = bkey[i] ^ 0x36363636;
				opad[i] = bkey[i] ^ 0x5C5C5C5C;
			}
			
			var hash = Crypto.MD5.binl_md5(ipad.concat(Crypto.MD5.rstr2binl(data)), 512 + data.length * 8);
			
			return Crypto.MD5.binl2rstr(Crypto.MD5.binl_md5(opad.concat(hash), 512 + 128));
		},
		
		/*
		 * Convert a raw string to an array of little-endian words
		 * Characters >255 have their high-byte silently ignored.
		 */
		rstr2binl: function(input) {
			var output = Array(input.length >> 2);
			
			for(var i = 0; i < output.length; i++) {
				output[i] = 0;
			}
			
			for(var i = 0; i < input.length * 8; i += 8) {
				output[i>>5] |= (input.charCodeAt(i / 8) & 0xFF) << (i%32);
			}
			
			return output;
		},
		
		/*
		 * Convert an array of little-endian words to a string
		 */
		binl2rstr: function(input){
			var output = "";
			
			for(var i = 0; i < input.length * 32; i += 8) {
				output += String.fromCharCode((input[i>>5] >>> (i % 32)) & 0xFF);
			}
			
			return output;
		},

		/*
		 * Calculate the MD5 of an array of little-endian words, and a bit length.
		 */
		binl_md5: function(x, len) {
			/* append padding */
			x[len >> 5] |= 0x80 << ((len) % 32);
			x[(((len + 64) >>> 9) << 4) + 14] = len;
			
			var a =			1732584193;
			var b = -271733879;
			var c = -1732584194;
			var d =			271733878;
			
			for(var i = 0; i < x.length; i += 16) {
				var olda = a;
				var oldb = b;
				var oldc = c;
				var oldd = d;

				a = Crypto.MD5.md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);
				d = Crypto.MD5.md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);
				c = Crypto.MD5.md5_ff(c, d, a, b, x[i+ 2], 17,			606105819);
				b = Crypto.MD5.md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);
				a = Crypto.MD5.md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);
				d = Crypto.MD5.md5_ff(d, a, b, c, x[i+ 5], 12,			1200080426);
				c = Crypto.MD5.md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);
				b = Crypto.MD5.md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);
				a = Crypto.MD5.md5_ff(a, b, c, d, x[i+ 8], 7 ,			1770035416);
				d = Crypto.MD5.md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);
				c = Crypto.MD5.md5_ff(c, d, a, b, x[i+10], 17, -42063);
				b = Crypto.MD5.md5_ff(b, c, d, a, x[i+11], 22, -1990404162);
				a = Crypto.MD5.md5_ff(a, b, c, d, x[i+12], 7 ,			1804603682);
				d = Crypto.MD5.md5_ff(d, a, b, c, x[i+13], 12, -40341101);
				c = Crypto.MD5.md5_ff(c, d, a, b, x[i+14], 17, -1502002290);
				b = Crypto.MD5.md5_ff(b, c, d, a, x[i+15], 22,			1236535329);

				a = Crypto.MD5.md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);
				d = Crypto.MD5.md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);
				c = Crypto.MD5.md5_gg(c, d, a, b, x[i+11], 14,			643717713);
				b = Crypto.MD5.md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);
				a = Crypto.MD5.md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);
				d = Crypto.MD5.md5_gg(d, a, b, c, x[i+10], 9 ,			38016083);
				c = Crypto.MD5.md5_gg(c, d, a, b, x[i+15], 14, -660478335);
				b = Crypto.MD5.md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);
				a = Crypto.MD5.md5_gg(a, b, c, d, x[i+ 9], 5 ,			568446438);
				d = Crypto.MD5.md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);
				c = Crypto.MD5.md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);
				b = Crypto.MD5.md5_gg(b, c, d, a, x[i+ 8], 20,			1163531501);
				a = Crypto.MD5.md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);
				d = Crypto.MD5.md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);
				c = Crypto.MD5.md5_gg(c, d, a, b, x[i+ 7], 14,			1735328473);
				b = Crypto.MD5.md5_gg(b, c, d, a, x[i+12], 20, -1926607734);

				a = Crypto.MD5.md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);
				d = Crypto.MD5.md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);
				c = Crypto.MD5.md5_hh(c, d, a, b, x[i+11], 16,			1839030562);
				b = Crypto.MD5.md5_hh(b, c, d, a, x[i+14], 23, -35309556);
				a = Crypto.MD5.md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);
				d = Crypto.MD5.md5_hh(d, a, b, c, x[i+ 4], 11,			1272893353);
				c = Crypto.MD5.md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);
				b = Crypto.MD5.md5_hh(b, c, d, a, x[i+10], 23, -1094730640);
				a = Crypto.MD5.md5_hh(a, b, c, d, x[i+13], 4 ,			681279174);
				d = Crypto.MD5.md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);
				c = Crypto.MD5.md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);
				b = Crypto.MD5.md5_hh(b, c, d, a, x[i+ 6], 23,			76029189);
				a = Crypto.MD5.md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);
				d = Crypto.MD5.md5_hh(d, a, b, c, x[i+12], 11, -421815835);
				c = Crypto.MD5.md5_hh(c, d, a, b, x[i+15], 16,			530742520);
				b = Crypto.MD5.md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);

				a = Crypto.MD5.md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);
				d = Crypto.MD5.md5_ii(d, a, b, c, x[i+ 7], 10,			1126891415);
				c = Crypto.MD5.md5_ii(c, d, a, b, x[i+14], 15, -1416354905);
				b = Crypto.MD5.md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);
				a = Crypto.MD5.md5_ii(a, b, c, d, x[i+12], 6 ,			1700485571);
				d = Crypto.MD5.md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);
				c = Crypto.MD5.md5_ii(c, d, a, b, x[i+10], 15, -1051523);
				b = Crypto.MD5.md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);
				a = Crypto.MD5.md5_ii(a, b, c, d, x[i+ 8], 6 ,			1873313359);
				d = Crypto.MD5.md5_ii(d, a, b, c, x[i+15], 10, -30611744);
				c = Crypto.MD5.md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);
				b = Crypto.MD5.md5_ii(b, c, d, a, x[i+13], 21,			1309151649);
				a = Crypto.MD5.md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);
				d = Crypto.MD5.md5_ii(d, a, b, c, x[i+11], 10, -1120210379);
				c = Crypto.MD5.md5_ii(c, d, a, b, x[i+ 2], 15,			718787259);
				b = Crypto.MD5.md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);

				a = Crypto.safe_add(a, olda);
				b = Crypto.safe_add(b, oldb);
				c = Crypto.safe_add(c, oldc);
				d = Crypto.safe_add(d, oldd);
			}
			
			return Array(a, b, c, d);
		},

		/*
		 * These functions implement the four basic operations the algorithm uses.
		 */
		md5_cmn: function(q, a, b, x, s, t) {
			return Crypto.safe_add(Crypto.bit_rol(Crypto.safe_add(Crypto.safe_add(a, q), Crypto.safe_add(x, t)), s),b);
		},
		
		md5_ff: function(a, b, c, d, x, s, t) {
			return Crypto.MD5.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
		},
		
		md5_gg: function(a, b, c, d, x, s, t) {
			return Crypto.MD5.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
		},
		
		md5_hh: function(a, b, c, d, x, s, t) {
			return Crypto.MD5.md5_cmn(b ^ c ^ d, a, b, x, s, t);
		},
		
		md5_ii: function(a, b, c, d, x, s, t) {
			return Crypto.MD5.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
		}
	}
};
