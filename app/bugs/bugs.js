'use strict';

angular.module('myApp.bugs', ['ngRoute'])
    .controller('mainCtrlPouchDB', mainCtrlPouchDB)
      .controller('mainDeleteModalCtrl', mainDeleteModalCtrl)

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/bugs', {
    templateUrl: 'bugs/bugs.html',
    controller: 'mainCtrlPouchDB'
  });
}])

    mainCtrlPouchDB.$inject = ['$scope', '$modal', 'fCommon'];

    function mainCtrlPouchDB($scope, $modal, fCommon) {
    
        //new PouchDB('ebugs').destroy()
        $scope.db = new PouchDB('ebugs');
        $scope.pouchDBList = [];

        // Methods called on the server (c#)

        $scope.DeleteBug = function (b, key) {
            var message = "Do you really want to delete?";

            var size = 'sm';
            var modalInstance = $modal.open({
                templateUrl: 'bugs/mainDeleteModalCtrlContent.html',
                controller: 'mainDeleteModalCtrl',
                size: size,
                resolve: {
                    message: function () { return message; },
                }
            });

            modalInstance.result.then(function () {
                console.log('Modal says you want to update: ' + new Date());
                console.log(key)
                //signalRRealTimeUpdatesSQLServerHub.server.deleteBug(b, key);

                var bugId = $scope.bugsList[key]._id;
                $scope.bugsList.splice(key, 1);


                $scope.temp = [];
                $scope.db.allDocs({ include_docs: true, descending: true }, function (err, doc) {

                    //alert(bugId);
                    doc.rows.forEach(function (doc) {
                        if (doc.doc._id == bugId)
                            $scope.temp.push(doc)
                    });

                    //alert($scope.temp.length)
                    $scope.temp.forEach(function (b) {
                        var bug = $scope.db.get(b.doc._id.toString()).then(function (doc) {
                            doc._deleted = true;
                            return $scope.db.put(doc);
                        }).then(function (result) {
                            console.log("doc deleted")

                            $scope.db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                                redrawTodosUI(doc.rows);


                                $scope.pouchDBList.splice(key, 1);
                                $scope.$apply();

                            });

                        }).catch(function (err) {
                            console.log(err);
                        });


                    });


                });




            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });



        }
        $scope.UpdateBug = function (b, key) {
            // if new call add.
            if (b.status == "new") {

                // New record needs unique id
                var guid = fCommon.getGuid();

                var pBug = {
                    _id: guid.toString(),
                    problem: b.problem,
                    response: b.response,
                    dateCreated: new Date()
                };
                if (pBug.response != null) {
                    pBug.dateResolved = new Date();
                }
                $scope.db.put(pBug, function callback(err, result) {
                    if (!err) {
                        console.log('Successfully posted a pBug!');
                        console.dir(pBug);
                        showTodos();
                        $scope.bugsList[key]._id = pBug._id;
                        $scope.bugsList[key].problem = pBug.problem;
                        $scope.bugsList[key].response = pBug.response;
                        $scope.bugsList[key].dateCreated = pBug.dateCreated;
                        $scope.bugsList[key].dateResolved = pBug.dateResolved;

                        $scope.pouchDBList.push(pBug)
                        $scope.$apply();
                    }
                    else {
                        console.log("Error: " + err);
                    }
                });


            }
            else {

                var bugId = $scope.bugsList[key]._id;
                if (b.problem == null) {
                    alert("Hey!!! Enter a problem please.")
                    return;
                }
                if (b.response != null) {
                    b.dateResolved = new Date();
                }
                angular.forEach($scope.bugsList, function (item, key1) {

                    if (key == key1) {
                        item.problem = b.problem;
                        item.response = b.response;
                        item.dateCreated = b.dateCreated;
                        item.dateResolved = b.dateResolved;
                        item.editColor = "transparent";
                        item.isDisabled = false;
                    }
                });

                var pBug = $scope.db.get(bugId.toString()).then(function (doc) {

                    return $scope.db.put(
                        {
                            _id: bugId.toString(),
                            _rev: doc._rev,
                            problem: b.problem,
                            response: b.response,
                            dateCreated: b.dateCreated,
                            dateResolved: b.dateResolved,
                        }

                        );
                }).then(function (result) {
                    console.log("doc updated")
                    showTodos();
                    angular.forEach($scope.pouchDBList, function (bug) {
                        console.dir(bug)
                        if (bug._id == bugId) {
                            bug.problem = b.problem;
                            bug.response = b.response;
                            bug.dateCreated = b.dateCreated;
                            bug.dateResolved = b.dateResolved;
                            $scope.$apply();
                        }
                    });


                }).catch(function (err) {
                    console.log(err);
                });

            }

            $scope.bugsList[key].isEditable = false;
            $scope.bugsList[key].status = "old";

        }
        $scope.UpdateAll = function () {

            angular.forEach($scope.bugsList, function (b, key) {

                if ($scope.bugsList[key].isEditable == true) {
                    $scope.UpdateBug(b, key);
                }


            });

        };
        $scope.EditBug = function (b, key) {

            $scope.bugsList[key].isEditable = true;



        };
        $scope.CancelBug = function (b, key) {

            $scope.bugsList[key].isEditable = false;
            $scope.bugsList[key].problem = $scope.bugsList[key].origProblem
            $scope.bugsList[key].response = $scope.bugsList[key].origResponse

            // Notify to unlock others out of this record
            signalRRealTimeUpdatesSQLServerHub.server.editAllowBug(b, key).done(function () {
                console.log('Success!')
            }).fail(function (e) {
                console.warn(e);

            });
        };
        $scope.AddToBugsList = function () {

            var key = $scope.bugsList.length;

            $scope.bugsList.push(new bugsViewModel(null, null, null, null));
            $scope.bugsList[key].isEditable = true;
            $scope.bugsList[key].status = "new";

        }

        activate();

        function activate() {

            // console.log("Start: activate")

            // Draw PouchDB
            $scope.bugsList = [];
            $scope.db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                redrawTodosUI(doc.rows);

                doc.rows.forEach(function (doc) {
                    console.dir(doc.doc)
                    $scope.bugsList.push(doc.doc)
                    $scope.pouchDBList.push(doc.doc)
                });

                $scope.$apply();

            });


            // console.log("End: activate")

        }

        function showTodos() {
            $scope.db.allDocs({ include_docs: true, descending: true }, function (err, doc) {
                redrawTodosUI(doc.rows);

            });
        }

        function redrawTodosUI(todos) {
            var ul = document.getElementById('todo-list');
            ul.innerHTML = '';
            todos.forEach(function (todo) {
                ul.appendChild(createTodoListItem(todo.doc));
            });
        }

        function createTodoListItem(bug) {


            var labelProblem = document.createElement('label');
            labelProblem.style.margin = "00px 10px 00px 00px";
            labelProblem.appendChild(document.createTextNode("Problem: " + bug.problem));
            var labeResponse = document.createElement('label');
            labeResponse.style.margin = "00px 10px 00px 00px";
            labeResponse.appendChild(document.createTextNode("Response: " + bug.response));

            var labeDateCreated = document.createElement('label');
            labeDateCreated.style.margin = "00px 10px 00px 00px";

            labeDateCreated.appendChild(document.createTextNode("Created: " + quickDateFormat(bug.dateCreated)));

            var labeDateResolved = document.createElement('label');
            if (bug.dateResolved != null) {
                labeDateResolved.appendChild(document.createTextNode("Answered: " + quickDateFormat(bug.dateResolved)));
            }


            var divDisplay = document.createElement('div');
            divDisplay.className = 'view';
            divDisplay.appendChild(labelProblem);
            divDisplay.appendChild(labeResponse);
            divDisplay.appendChild(labeDateCreated);
            divDisplay.appendChild(labeDateResolved);


            var li = document.createElement('li');
            li.id = 'li_' + bug._id;
            li.appendChild(divDisplay);
            //li.appendChild(inputEditTodo);


            return li;
        }
    }

    function quickDateFormat(dateIn) {
        var dateOut =
    dateIn.getDate().toString() + "/" +
    (dateIn.getMonth() + 1).toString() + "/" +
    dateIn.getFullYear().toString() + " @ " +
       dateIn.getHours().toString() + ":" +
       dateIn.getMinutes().toString();

        return dateOut;
    }
    function bugsViewModel(id, problem, response, dateCreated, dateResolved) {
        this.id = id;
        this.problem = problem;
        this.response = response;
        this.dateCreated = dateCreated;
        this.dateResolved = dateResolved;
        this.isEditable = false;
        //this.editColor = 'yellow';

    }

    function mainDeleteModalCtrl($scope, $modalInstance, message) {


        $scope.message = message;

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        activate();

        function activate() {


        }
    }