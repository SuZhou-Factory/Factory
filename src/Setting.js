var Setting = {
	host: 'http://192.168.1.100/factorys/',
	url : '../SuZhou/data/goods.json',
	sendData: '{"body": {"name": "tom","password":"111111"},"head": {"tokenId": "20983678","version": "1.0"},"mac": ""}',

	login: {
		url: 'login',
		data: {
            username: 'admin',
            password: '111111',
        }
	},

};

var TestData = {
    debug: true,
    login: {"user":{"factoryname":null,"id":1,"edittime":"Sun Aug 09 19:57:17 CST 2015","username":"admin","roleid":1,"name":"s","rights":[{"id":2,"name":"人员管理","value":"","parentid":0,"hasRight":false,"parentname":null},{"id":3,"name":"员工","value":"user/index","parentid":2,"hasRight":false,"parentname":"人员管理"},{"id":4,"name":"供应商","value":"supplier/index","parentid":2,"hasRight":false,"parentname":"人员管理"},{"id":5,"name":"客户","value":"client/index","parentid":2,"hasRight":false,"parentname":"人员管理"},{"id":6,"name":"货","value":null,"parentid":0,"hasRight":false,"parentname":null},{"id":7,"name":"货下","value":null,"parentid":6,"hasRight":false,"parentname":"货"},{"id":8,"name":"货下2","value":null,"parentid":6,"hasRight":false,"parentname":"货"}],"deadtime":null,"factoryid":1}},
    right: {
        index: {"rights":[{"id":2,"name":"人员管理","value":"","parentid":0,"hasRight":false,"parentname":null},{"id":3,"name":"员工","value":"user/index","parentid":2,"hasRight":false,"parentname":"人员管理"},{"id":4,"name":"供应商","value":"supplier/index","parentid":2,"hasRight":false,"parentname":"人员管理"},{"id":5,"name":"客户","value":"client/index","parentid":2,"hasRight":false,"parentname":"人员管理"}],"totalSize":4,"totalPage":1},
    },
};