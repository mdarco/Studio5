(function () {
    'use strict';

    angular
        .module('DFApp')
        .controller('CheckboxTreeDialogController', ctrlFn);

    ctrlFn.$inject = ['$scope', '$uibModalInstance', '$timeout', 'ivhTreeviewMgr', /* 'ivhTreeviewBfs', */ 'toastr', 'treeData', 'treeSelectedNodes', 'singleSelect', 'rootSelectAllowed', 'options'];

    function ctrlFn($scope, $uibModalInstance, $timeout, ivhTreeviewMgr, /* ivhTreeviewBfs, */ toastr, treeData, treeSelectedNodes, singleSelect, rootSelectAllowed, options) {
        $scope.viewSettings = {};
        $scope.treeSearch = null;

        $scope.options = {};
        if (options) {
            $scope.options = options;
        }

        var isSingleSelect = (singleSelect === true || $scope.options.singleSelect === true);
        var isRootSelectAllowed = (rootSelectAllowed === true || $scope.options.rootSelectAllowed === true);

        // if there is only one item in the tree
        // should it be automatically selected?
        var isAutoSelectOnlyOneItem = ($scope.options.autoSelectOnlyOneItem === true);

        $scope.treeData = treeData.data;

        // (string) list of selected node IDs
        var selectedNodes = [];
        if (treeSelectedNodes && _.isArray(treeSelectedNodes) && treeSelectedNodes.length > 0) {
            //selectedNodes = getNodes(treeSelectedNodes);
            selectedNodes = treeSelectedNodes;

            // refresh tree checkboxes according to selection
            var treeSelectedNodeID = _.map(treeSelectedNodes, 'id');
            ivhTreeviewMgr.selectEach($scope.treeData, treeSelectedNodeID);
        }

        if ($scope.treeData.length === 1 && isAutoSelectOnlyOneItem) {
            // select the only item in the tree
            var onlyNodeID = $scope.treeData[0].id;
            ivhTreeviewMgr.selectEach($scope.treeData, [onlyNodeID]);
            selectedNodes.push($scope.treeData[0]);
        }

        $scope.checkboxChangeCallback = function (node, isSelected, tree) {
            // check for root selection
            if (isSelected && !isRootSelectAllowed) {
                var rootNode = _.find(tree, { id: node.id });
                if (rootNode) {
                    toastr.warning('Nije dozvoljen izbor korenskih stavki.');

                    $timeout(function () {
                        ivhTreeviewMgr.deselect($scope.treeData, node);
                    }, 500);

                    return;
                }
            }

            // check for single select
            if (isSelected && isSingleSelect && selectedNodes.length > 0) {
                toastr.warning('Dozvoljen je izbor samo jedne stavke.');

                $timeout(function () {
                    ivhTreeviewMgr.deselect($scope.treeData, node);
                }, 500);

                return;
            }

            if (isSelected) {
                // add node to selected list
                selectedNodes.push(node);
            } else {
                // remove node from selected list
                _.pullAllBy(selectedNodes, [{ id: node.id }], 'id');
            }
        };

        $scope.close = function () {
            $uibModalInstance.dismiss();
        };

        $scope.save = function () {
            $uibModalInstance.close(_.uniqBy(selectedNodes, 'id'));
        };
    }
})();
