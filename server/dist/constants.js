"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db_password = exports.db_username = exports.db_port = exports.db_host = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === 'production';
exports.db_host = process.env.NODE_ENV === '127.0.0..1';
exports.db_port = process.env.NODE_ENV === '5432';
exports.db_username = process.env.NODE_ENV === 'brian27';
exports.db_password = process.env.NODE_ENV === 'love5430';
//# sourceMappingURL=constants.js.map