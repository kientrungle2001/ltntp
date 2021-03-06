flApp.controller('GameController', ['$scope', function($scope) {
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
	$scope.loadGameTypes = function() {
		jQuery.ajax({
			type: 'post',
			url: FL_API_URL +'/game/getType', 
			
			dataType: 'json',
			success: function(resp) {
				$scope.gameTypes = buildBottomTree(resp);
				$scope.$apply();
			}
		});	
	};
	$scope.loadGameTypes();
	$scope.selectGameType = function(){
		$scope.play = false;
		$scope.selectedGameTopic = '';
		$scope.loadGaneTopics($scope.selectedGameType);
	}
	$scope.loadGaneTopics = function(gamecode){
		if(gamecode == 'muatu'){

			jQuery.ajax({
				url: FL_API_URL +'/gametopics', 
				dataType: 'json',
				success: function(resp) {

					var gameTopics = buildBottomTree(resp);
					$scope.muatuTopics = treefy(gameTopics, 0);
					$scope.$apply();
				}
			});	
		}else if(gamecode == 'dragWord'){
			jQuery.ajax({
				url: FL_API_URL +'/games?gamecode=dragWord', 
				dataType: 'json',
				success: function(resp) {
					$scope.dragTopics = resp;
					$scope.$apply();
				}
			});	
		}
		else{
			$scope.gameTopics = [];
		}
	}
	var u = new URL(location.href);
	$scope.selectedGameType = u.searchParams.get('gameType');
	if($scope.selectedGameType){
		$scope.loadGaneTopics($scope.selectedGameType);
	}
	$scope.selectedGameTopic = u.searchParams.get('gameTopic');

	
	$scope.playGame = function(){
		
		if(!$scope.selectedGameType){
			alert('Bạn chưa chọn loại game');
			jQuery('#gameType').focus();
			return false;
		}
		if(!$scope.selectedGameTopic){
			alert('Bạn chưa chọn chủ đề');
			jQuery('#gameTopic').focus();
			return false;
		}
		if($scope.selectedGameType && $scope.selectedGameTopic){

			window.location.href = '/game.php?gameType='+$scope.selectedGameType+'&gameTopic='+$scope.selectedGameTopic;
			

		}

	}

	$scope.loadGame = function() {
		if($scope.selectedGameType && $scope.selectedGameTopic){
			if($scope.selectedGameType == 'muatu'){
				jQuery.ajax({
					url: FL_API_URL +'/games?gamecode=muatu&game_topic_id='+$scope.selectedGameTopic, 
					dataType: 'json',
					success: function(resp) {
						$scope.totalWord = resp[0].dataword.split(/,[ ]*/).length;
						$scope.allWord = resp[0].dataword.split(/,[ ]*/).chunk(5);
						$scope.trueWord = resp[0].datatrue.split(/,[ ]*/);
						$scope.question = resp[0].question;
						$scope.$apply();
					}
				});		
			}else if($scope.selectedGameType == 'dragWord'){
				jQuery.ajax({
					url: FL_API_URL +'/games?id='+$scope.selectedGameTopic, 
					dataType: 'json',
					success: function(resp) {
						var words = false;
						if(resp[0].question != '') {
							words = resp[0].question.split(/\r\n|\r|\n|\<br \/\>|\<br\/\>/);
						}

						var dataTopics = [];
						var dataWords = [];
						var subword = [];

						if(words) {
							
							for(var i = 0; i < words.length; i++) {
								var tam = words[i].split(':');
								//xu li topic
								var dataTopic = {};
								dataTopic['type'] = tam[0];
								dataTopic['name'] = tam[0];
								dataTopics.push(dataTopic);
								//xu li word
								var typeWrod = tam[0];
								var tamWord = tam[1].split(',');

								subword.push([]);
								for(var j=0; j < tamWord.length; j++) {
									subword[i].push({
										type: typeWrod,
										name: tamWord[j]
									});


								}

							}

							
							//data word
							for(var i=0; i < subword.length; i++) {
								for(var j=0; j < subword[i].length; j++) {
									dataWords.push(subword[i][j]);
								}
							}

						}

						$scope.dataTopics = dataTopics;
						$scope.dataCells = dataWords;
						$scope.$apply();
					}
				});	
			}
		}
		
	};
	$scope.loadGame();

	$scope.loadGameRate = function() {
		if($scope.selectedGameType && $scope.selectedGameTopic){
			if($scope.selectedGameType == 'muatu'){
				jQuery.ajax({
					type: 'post',
					url: FL_API_URL +'/game/getScores',
					data: {gamecode:$scope.selectedGameType , topic: $scope.selectedGameTopic,
					software: SOFTWARE,
					site: SITE
				},
					dataType: 'json',
					success: function(resp) {
						$scope.ranks = resp;
						$scope.$apply();
					}
				});		
			}
		}
		
	};
	$scope.loadGameRate();

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