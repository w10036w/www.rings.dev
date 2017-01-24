const mongoose = require('mongoose');
const crypto = require('crypto');

const regex = require('../../public/util/regex')

const Schema = mongoose.Schema;
const oAuthTypes = [
  'github',
  'twitter',
  'facebook',
  'google',
  'linkedin'
];

const UserSchema = new Schema({
  name: {
    type: String,
    default: '',
    set(val) {
      return val.trim().toLowerCase();
    },
    index: {
      unique: true
    }
  },
  email: { type:String, default:'', unique:true, sparse:true },
  username: { type: String, default: '' }, //nickname
  hashed_password: { type: String, default: '' },
  avatar: { type: String, default: '' },
  provider: { type: String, default: 'local' },
  role: { type: String, default: 'visitor' },
  salt: { type: String, default: '' },
  authToken: { type: String, default: '' }
});

const validatePresenceOf = value => value && value.length;

UserSchema
  .virtual('password')
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

/**
 * Validations
 */
//null and duplicate check
UserSchema.path('name').validate(function (name) {
  if (this.skipValidation()) return true;
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
  if (this.skipValidation()) return true;
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  if (this.skipValidation()) return true;
  return hashed_password.length && this._password.length;
}, 'Password cannot be blank');

UserSchema.path('email').validate(function (email) {
  if (this.skipValidation()) return true;
  return (email.match(regex.email) != null)
}, 'Email is not valid');

UserSchema.path('email').validate(function (email, fn) {
  const User = mongoose.model('User');
  if (this.skipValidation()) fn(true);
  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, 'Email already exists');

UserSchema.path('name').validate(function (name, fn) {
  const User = mongoose.model('User');
  if (this.skipValidation()) fn(true);
  if (this.isNew) {
    User.find({ name: name }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, 'name already exists');



/**
 * Pre-save hook
 */
UserSchema.pre('save', function (next) {
  if (!this.isNew) return next();
  if (!validatePresenceOf(this.password) && !this.skipValidation()) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});

/**
 * Methods
 */
UserSchema.methods = {
  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  /**
   * Encrypt password
   *
   * @param {String} password
   * @return {String}
   * @api public
   */
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  /**
   * Validation is not required if using OAuth
   */
  skipValidation: function () {
    return ~oAuthTypes.indexOf(this.provider);
  }
};

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Load
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */
  load: function (options, cb) {
    options.select = options.select || 'name username role provider';
    return this.findOne(options.criteria)
      .select(options.select)
      .exec(cb);
  }
};
//compound indexes
//UserSchema.index({ email:1, name:-1 }, { unique:true });

module.exports = mongoose.model('User', UserSchema);

