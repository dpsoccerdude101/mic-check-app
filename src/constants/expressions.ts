export const PhoneNumberExpression = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
export const URLExpression: RegExp = /((https?):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
export const UserNameValidationRegex: RegExp = /^([A-Z]|[a-z])([a-z]|[A-Z]|[0-9])+$/;
export const PasswordValidationRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;

/**
 * The following Regex will return the videoID of the YouTube video
 * at the sixth pattern match group, e.g.
 * const remoDriveVideoURL = 'https://www.youtube.com/embed/ZpaCfVwRInU?start=390&end=420';
 * const matchedGroups = remoDriveVideoURL.match(YouTubeURLRegex);
 * console.log(matchedGroups[5]); //Prints out 'ZpaCfVwRInU'
 */
 export const YouTubeURLRegex: RegExp =
 /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;