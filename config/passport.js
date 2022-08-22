const dotenv = require('dotenv');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../model/User');
dotenv.config();

module.exports = (passport)=>{
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/users/auth/google/callback",
        scope: ['profile', 'email']
      },
      async function(accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return done(err, user);
        // });
        try {
            let user = await User.findOne({googleId: profile.id});
            if(user){
                done(null, user);
                //console.log(user);
            }
            else{
                const newUser = ({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    picture: profile.photos[0].value,
                    password: Date.now() + "wrytaid"
                });
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (err) {
            console.log(err);
        }
      }
    ));

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        })
    });
}