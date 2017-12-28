;(function (factory) {
	'use strict';
	if (typeof define === "function" && define.amd) {
		// AMD模式
		define(['jquery'], factory);
	} else {
		// 全局模式
		factory(jQuery);
	}
}(function ($) {
	window.qiniu_upload = function(opts) {
		var formData = new FormData();
		
		// TODO: 改成从后台获取token

		formData.append('file', opts.data.file);
		// 这里需要设置正确的token
		formData.append('token', 'pBwzxNPBDAAD9cJaND2xh3TkgtTilQERWHSByAQ_:9CNVM9IegER_FjIbGKw3qcjTvIQ=:eyJzY29wZSI6ImJwbXRlc3QiLCJkZWFkbGluZSI6MTU0OTIxNTMxNX0=');
		formData.append('key', opts.data.key);

		$.ajax({
			url: 'http://up-z1.qiniu.com',
			method: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			/*xhr: function(){
				myXhr = $.ajaxSettings.xhr();	 
				if(myXhr.upload){
					myXhr.upload.addEventListener('progress',function(e) {
						// console.log(e);
						if (e.lengthComputable) {
							var percent = e.loaded/e.total*100;
							$progress.html('上传：' + e.loaded + "/" + e.total+" bytes. " + percent.toFixed(2) + "%");
						}
					}, false);
				}
				return myXhr;
			},*/
			beforeSend: function(xhr) {
				console.log('BEFORESEND', xhr);
				if (opts.beforeSend) {
					opts.beforeSend(xhr);
				}
			},
			success: function(res) {
				console.log('SUCCESS', res);
				if (opts.success) {
					opts.success(res);
				}
			},
			error: function(res) {
				console.log('ERROR', res);
				if (opts.error) {
					opts.error(res);
				}
			},
			complete: function(res, ts) {
				console.log('COMPLETE', res, ts);
				if (opts.complete) {
					opts.complete(res, ts);
				}
			}
		});
	}
}));