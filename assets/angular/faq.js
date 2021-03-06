flApp.controller('FaqController', ['$scope', function($scope) {
	$scope.title = 'Công ty cổ phần giáo dục và phát triển trí tuệ sáng tạo Next Nobels';
	$scope.language = 'vn';
	$scope.changeLanguage = function() {
		window.localStorage.setItem('language', $scope.language);
	}
	
	$scope.grade = window.localStorage.getItem('grade') || '5';
	$scope.changeGrade = function() {
		window.localStorage.setItem('grade', $scope.grade);
	}
	$scope.translateOptions = {
		'category.name': {
			'en': 'name',
			'vn': 'name_vn'
		},
		'test.name': {
			'vn': 'name',
			'en': 'name_en'
		}
	};

	$scope.translate = function (val, opt) {
		var language = $scope.language;
		if (language != 'en') {
			language = 'vn';
		}
		if (typeof val == 'string')
			return $langMap[language][val] || val;
		if (typeof val == 'object') {
			var options = $scope.translateOptions[opt];
			if (language == 'vn') {
				return val[options.vn];
			} else {
				return val[options.en];
			}
		}
	};
	$scope.questions = [];
	jQuery.ajax({
		url: FL_API_URL +'/aqs/getQuestions',
		type: 'post',
		data: {
			pageNumber: 1,
			software: SOFTWARE,
			site: SITE
		}, 
		success: function(resp) {
			$scope.questions = resp;
			$scope.$apply();
		}
	});
	$scope.addQuestion = function(id){
		if(!userId){
			alert('Đăng nhập để gửi câu hỏi');
			return false;
			
		}else{
			var question = jQuery('#question').val();
			if(question.length > 0){
				jQuery.ajax({
					url: FL_API_URL +'/aqs/createQuestions',
					type: 'post',
					data: {
						userId: userId, username: username, question: question,
						software: SOFTWARE,
						site: SITE
					}, 
					success: function(resp) {
						window.location.reload();
					}
				});
			}else{
				alert('Nhập nội dung câu hỏi!');
				jQuery('#question').focus();
				return false;
			}
			
		}
	}
	$scope.addAnswer = function(questionId){
		var answer = jQuery('#answer'+questionId).val();
		if(answer.length > 0){
			jQuery.ajax({
				url: FL_API_URL +'/aqs/createQuestionAnswers',
				type: 'post',
				data: {userId: userId, username: username, questionId: questionId, answer: answer,
						software: SOFTWARE,
						site: SITE
					}, 
				success: function(resp) {
					window.location.reload();
				}
			});
		}else{
			alert('Nhập nội dung câu trả lời!');
			jQuery('#answer'+questionId).focus();
			return false;
		}
	}
	$scope.pageSize = 6;
	$scope.curentPage = 1;
	$scope.pages = [];
	$scope.totalQuestion = 0;
	$scope.getTotalQuestion = function(){
		jQuery.ajax({
			url: FL_API_URL +'/aqs/countQuestions',
			type: 'post',
			data: {
				software: SOFTWARE,
				site: SITE
			}
			success: function(resp) {
				$scope.totalQuestion = resp;
				$scope.pagination($scope.pageSize, resp);
				$scope.$apply();

			}
		});
	}
	$scope.subjects = [];
	jQuery.ajax({url: FL_API_URL +'/common/getSubjects', success: function(resp) {
		$scope.subjects = resp;
		$scope.$apply();
	}});
	$scope.tests = [];
	jQuery.ajax({
		type: 'post',
		url: FL_API_URL +'/common/getTests', 
		data: {
			categoryId: '1417',
			software: SOFTWARE,
			site: SITE
		},
		dataType: 'json',
		success: function(resp) {
			$scope.tests = buildBottomTree(resp);
			$scope.$apply();
		}
		
	});
	$scope.tvTests = [];
	jQuery.ajax({
		type: 'post',
		url: FL_API_URL +'/common/getTests', 
		data: {
			categoryId: '1413',
			software: SOFTWARE,
			site: SITE
		},
		dataType: 'json',
		success: function(resp) {
			$scope.tvTests = buildBottomTree(resp);
			$scope.$apply();
		}
		
	});
	$scope.englishTests = [];
	jQuery.ajax({
		type: 'post',
		url: FL_API_URL +'/common/getTests', 
		data: {
			categoryId: '1411',
			software: SOFTWARE,
			site: SITE
		},
		dataType: 'json',
		success: function(resp) {
			$scope.englishTests = resp;
			$scope.$apply();
		}
	});
	$scope.testSets = [];
	jQuery.ajax({
		type: 'post',
		url: FL_API_URL +'/common/getTestSets', 
		data: {
			categoryId: '1416',
			software: SOFTWARE,
			site: SITE
		},
		dataType: 'json',
		success: function(resp) {
			$scope.testSets = buildBottomTree(resp);
			$scope.$apply();
		}
	});	
	$scope.realTestSets = [];
	jQuery.ajax({
		type: 'post',
		url: FL_API_URL +'/common/getTestSets', 
		data: {
			categoryId: '1414',
			software: SOFTWARE,
			site: SITE
		},
		dataType: 'json',
		success: function(resp) {
			$scope.realTestSets = buildBottomTree(resp);
			$scope.$apply();
		}
	});
	$scope.inPage = function(index, page, pageSize) {
		return (index >= page * pageSize) && (index < (page + 1) * pageSize);
	};
	$scope.totalPage = function(numberOfItem, pageSize) {
		var rs = Math.ceil(numberOfItem / pageSize);
		return rs;
	};
	$scope.range = function(min, max, step) {
		var rs = [];
		for(var i = min; i <= max; i+= step) {
			rs.push(i);
		}
		return rs;
	};
	$scope.selectEnglishTestPage = function(page) {
		$scope.selectedEnglishTestPage = page;
		$scope.$apply();
	};
	$scope.selectTestPage = function (page) {
		$scope.selectedTestPage = page;
		$scope.$apply();
	};
	$scope.selectTvTestPage = function (page) {
		$scope.selectedTvTestPage = page;
		$scope.$apply();
	};
	$scope.selectTestSetPage = function (page) {
		$scope.selectedTestSetPage = page;
		$scope.$apply();
	};
	$scope.getTotalQuestion();
	$scope.pagination = function(pageSize, total){

		if(total > pageSize){
			var page = total / pageSize;
			page = Math.ceil(page);
			for(var i =1; i < page; i++){
				$scope.pages.push(i);
			}
		}
	}
	$scope.pageAjax = function(that, page){
		jQuery.ajax({
			url: FL_API_URL +'/aqs/getQuestions',
			type: 'post',
			data: {
				pageNumber: page,
				software: SOFTWARE,
				site: SITE
			}, 
			success: function(resp) {
				$scope.questions = resp;
				$scope.curentPage = page;
				$scope.$apply();
			}
		});
		return false;
	}

	$scope.register = {};
	$scope.doRegister = function (url) {
		if (!$scope.register.username || !$scope.register.name || !$scope.register.password || !$scope.register.repassword || !$scope.register.phone || !$scope.register.email || !$scope.register.sex || !$scope.register.areacode) {
			return false;
		}
		$scope.register.url = url;
		$scope.register.software = SOFTWARE;
		$scope.register.site = SITE;
		if ($scope.register.password == $scope.register.repassword) {
			jQuery.post(FL_API_URL + '/register/userRegister', $scope.register, function (resp) {
				$scope.register.success = resp.success;
				$scope.register.message = resp.message;
				$scope.$apply();
				if (resp.success) {
					window.location = resp.url;
				}
			});

		} else {
			$scope.register.success = 0;
			$scope.register.message = "Mật khẩu tài khoản nhập lại không chính xác";

		}

	};
	$scope.login = {};
	$scope.doLogin = function (url) {
		if (!$scope.login.username || !$scope.login.password) {
			return false;
		}
		$scope.login.url = url;
		$scope.login.software = SOFTWARE;
		$scope.login.site = SITE;
		jQuery.post(FL_API_URL + '/login/userLogin', $scope.login, function (resp) {
			$scope.login.success = resp.success;
			$scope.login.message = resp.message;
			$scope.$apply();
			if (resp.success) {
				window.location = resp.url;
			}

		});
	};
	// get AreaCode
	$scope.areaCodes = [];
	jQuery.ajax({
		url: FL_API_URL + '/register/getAreaCode', success: function (resp) {
			$scope.areaCodes = resp;
			$scope.$apply();
		}
	});
}]);