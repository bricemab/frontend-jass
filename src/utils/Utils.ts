import * as CryptoJS from 'crypto-js';
import config from '@/config/config';
import qs from 'qs';
import {
  ApplicationError,
  ApplicationResponse,
  AuthenticationErrors,
  MessageErrorType,
  UserErrors
} from '@/Types/GlobalType';
import RequestManager from '@/utils/RequestManager';
import { createToast } from 'mosha-vue-toastify';
import i18n from '@/locales/i18n';
import { CardObjectType, CARDS, DeckCard } from '@/Types/CardsType';
import WebSocketOpCodeClient from '@/services/ws/WebSocketOpCodeClient';
import WebSocketOpCodeServer from '@/services/ws/WebSocketOpCodeServer';
import { Position } from 'mosha-vue-toastify/dist/types';
import Global from '@/utils/Global';

/**
 * Classe Utils contient :
 * La gestion d'affichage de notifications ou de toasts.
 * La gestion d'erreur pour les champs lors d'un ajout d'utilisateur et leur affichage.
 */
export default class Utils {
  static getCards (): CardObjectType[] {
    const cards: CardObjectType[] = [];
    CARDS.map(cardObject => {
      return cardObject.cards.forEach(c => {
        cards.push(c);
      });
    });
    return cards;
  }

  static getCardByKey (key: string): CardObjectType {
    return Utils.getCards().find(c => c.key === key)!;
  }

  static getLastPositionFromCurrent (currentPos: number) {
    if (currentPos === 1) {
      return 4;
    }
    return currentPos - 1;
  }

  static getNextPositionFromCurrent (currentPos: number) {
    if (currentPos === 4) {
      return 1;
    }
    return currentPos + 1;
  }

  static getCardPath (key: string, isBack = false) {
    if (isBack) {
      return require('@/assets/cards/card-back.png');
    }
    const card = Utils.getCardByKey(key);
    if (card) {
      return require('@/assets/cards/' + card.path);
    }
    return '';
  }

  static manageCommandsMessage (msg: string) {
    const command = (msg.split(' ')[0]).trim();
    switch (command) {
      case '/all':
        return {
          success: true,
          data: {
            opCode: WebSocketOpCodeServer.WSS_FROM__ALL_NEW_MESSAGE__REQUEST,
            msg: msg.slice(5)
          }
        };
        break;
      case '/team':
        return {
          success: true,
          data: {
            opCode: WebSocketOpCodeServer.WSS_FROM__TEAM_NEW_MESSAGE__REQUEST,
            msg: msg.slice(6)
          }
        };
        break;
      default:
        if (command.startsWith('/')) {
          return {
            success: false,
            error: {
              code: MessageErrorType.COMMAND_NOT_FOUND,
              details: `Command ${command} not found`
            }
          };
        } else {
          return {
            success: true,
            data: {
              opCode: WebSocketOpCodeServer.WSS_FROM__TEAM_NEW_MESSAGE__REQUEST,
              msg
            }
          };
        }
        break;
    }
  }

  static shortId () {
    return `_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  static getCountry (code: string) {
    const countries = [
      { name: 'Afghanistan', code: 'AF' },
      { name: 'Åland Islands', code: 'AX' },
      { name: 'Albania', code: 'AL' },
      { name: 'Algeria', code: 'DZ' },
      { name: 'American Samoa', code: 'AS' },
      { name: 'AndorrA', code: 'AD' },
      { name: 'Angola', code: 'AO' },
      { name: 'Anguilla', code: 'AI' },
      { name: 'Antarctica', code: 'AQ' },
      { name: 'Antigua and Barbuda', code: 'AG' },
      { name: 'Argentina', code: 'AR' },
      { name: 'Armenia', code: 'AM' },
      { name: 'Aruba', code: 'AW' },
      { name: 'Australia', code: 'AU' },
      { name: 'Austria', code: 'AT' },
      { name: 'Azerbaijan', code: 'AZ' },
      { name: 'Bahamas', code: 'BS' },
      { name: 'Bahrain', code: 'BH' },
      { name: 'Bangladesh', code: 'BD' },
      { name: 'Barbados', code: 'BB' },
      { name: 'Belarus', code: 'BY' },
      { name: 'Belgium', code: 'BE' },
      { name: 'Belize', code: 'BZ' },
      { name: 'Benin', code: 'BJ' },
      { name: 'Bermuda', code: 'BM' },
      { name: 'Bhutan', code: 'BT' },
      { name: 'Bolivia', code: 'BO' },
      { name: 'Bosnia and Herzegovina', code: 'BA' },
      { name: 'Botswana', code: 'BW' },
      { name: 'Bouvet Island', code: 'BV' },
      { name: 'Brazil', code: 'BR' },
      { name: 'British Indian Ocean Territory', code: 'IO' },
      { name: 'Brunei Darussalam', code: 'BN' },
      { name: 'Bulgaria', code: 'BG' },
      { name: 'Burkina Faso', code: 'BF' },
      { name: 'Burundi', code: 'BI' },
      { name: 'Cambodia', code: 'KH' },
      { name: 'Cameroon', code: 'CM' },
      { name: 'Canada', code: 'CA' },
      { name: 'Cape Verde', code: 'CV' },
      { name: 'Cayman Islands', code: 'KY' },
      { name: 'Central African Republic', code: 'CF' },
      { name: 'Chad', code: 'TD' },
      { name: 'Chile', code: 'CL' },
      { name: 'China', code: 'CN' },
      { name: 'Christmas Island', code: 'CX' },
      { name: 'Cocos (Keeling) Islands', code: 'CC' },
      { name: 'Colombia', code: 'CO' },
      { name: 'Comoros', code: 'KM' },
      { name: 'Congo', code: 'CG' },
      { name: 'Congo, The Democratic Republic of the', code: 'CD' },
      { name: 'Cook Islands', code: 'CK' },
      { name: 'Costa Rica', code: 'CR' },
      { name: 'Cote D\'Ivoire', code: 'CI' },
      { name: 'Croatia', code: 'HR' },
      { name: 'Cuba', code: 'CU' },
      { name: 'Cyprus', code: 'CY' },
      { name: 'Czech Republic', code: 'CZ' },
      { name: 'Denmark', code: 'DK' },
      { name: 'Djibouti', code: 'DJ' },
      { name: 'Dominica', code: 'DM' },
      { name: 'Dominican Republic', code: 'DO' },
      { name: 'Ecuador', code: 'EC' },
      { name: 'Egypt', code: 'EG' },
      { name: 'El Salvador', code: 'SV' },
      { name: 'Equatorial Guinea', code: 'GQ' },
      { name: 'Eritrea', code: 'ER' },
      { name: 'Estonia', code: 'EE' },
      { name: 'Ethiopia', code: 'ET' },
      { name: 'Falkland Islands (Malvinas)', code: 'FK' },
      { name: 'Faroe Islands', code: 'FO' },
      { name: 'Fiji', code: 'FJ' },
      { name: 'Finland', code: 'FI' },
      { name: 'France', code: 'FR' },
      { name: 'French Guiana', code: 'GF' },
      { name: 'French Polynesia', code: 'PF' },
      { name: 'French Southern Territories', code: 'TF' },
      { name: 'Gabon', code: 'GA' },
      { name: 'Gambia', code: 'GM' },
      { name: 'Georgia', code: 'GE' },
      { name: 'Germany', code: 'DE' },
      { name: 'Ghana', code: 'GH' },
      { name: 'Gibraltar', code: 'GI' },
      { name: 'Greece', code: 'GR' },
      { name: 'Greenland', code: 'GL' },
      { name: 'Grenada', code: 'GD' },
      { name: 'Guadeloupe', code: 'GP' },
      { name: 'Guam', code: 'GU' },
      { name: 'Guatemala', code: 'GT' },
      { name: 'Guernsey', code: 'GG' },
      { name: 'Guinea', code: 'GN' },
      { name: 'Guinea-Bissau', code: 'GW' },
      { name: 'Guyana', code: 'GY' },
      { name: 'Haiti', code: 'HT' },
      { name: 'Heard Island and Mcdonald Islands', code: 'HM' },
      { name: 'Holy See (Vatican City State)', code: 'VA' },
      { name: 'Honduras', code: 'HN' },
      { name: 'Hong Kong', code: 'HK' },
      { name: 'Hungary', code: 'HU' },
      { name: 'Iceland', code: 'IS' },
      { name: 'India', code: 'IN' },
      { name: 'Indonesia', code: 'ID' },
      { name: 'Iran, Islamic Republic Of', code: 'IR' },
      { name: 'Iraq', code: 'IQ' },
      { name: 'Ireland', code: 'IE' },
      { name: 'Isle of Man', code: 'IM' },
      { name: 'Israel', code: 'IL' },
      { name: 'Italy', code: 'IT' },
      { name: 'Jamaica', code: 'JM' },
      { name: 'Japan', code: 'JP' },
      { name: 'Jersey', code: 'JE' },
      { name: 'Jordan', code: 'JO' },
      { name: 'Kazakhstan', code: 'KZ' },
      { name: 'Kenya', code: 'KE' },
      { name: 'Kiribati', code: 'KI' },
      { name: 'Korea, Democratic People\'S Republic of', code: 'KP' },
      { name: 'Korea, Republic of', code: 'KR' },
      { name: 'Kuwait', code: 'KW' },
      { name: 'Kyrgyzstan', code: 'KG' },
      { name: 'Lao People\'S Democratic Republic', code: 'LA' },
      { name: 'Latvia', code: 'LV' },
      { name: 'Lebanon', code: 'LB' },
      { name: 'Lesotho', code: 'LS' },
      { name: 'Liberia', code: 'LR' },
      { name: 'Libyan Arab Jamahiriya', code: 'LY' },
      { name: 'Liechtenstein', code: 'LI' },
      { name: 'Lithuania', code: 'LT' },
      { name: 'Luxembourg', code: 'LU' },
      { name: 'Macao', code: 'MO' },
      { name: 'Macedonia, The Former Yugoslav Republic of', code: 'MK' },
      { name: 'Madagascar', code: 'MG' },
      { name: 'Malawi', code: 'MW' },
      { name: 'Malaysia', code: 'MY' },
      { name: 'Maldives', code: 'MV' },
      { name: 'Mali', code: 'ML' },
      { name: 'Malta', code: 'MT' },
      { name: 'Marshall Islands', code: 'MH' },
      { name: 'Martinique', code: 'MQ' },
      { name: 'Mauritania', code: 'MR' },
      { name: 'Mauritius', code: 'MU' },
      { name: 'Mayotte', code: 'YT' },
      { name: 'Mexico', code: 'MX' },
      { name: 'Micronesia, Federated States of', code: 'FM' },
      { name: 'Moldova, Republic of', code: 'MD' },
      { name: 'Monaco', code: 'MC' },
      { name: 'Mongolia', code: 'MN' },
      { name: 'Montserrat', code: 'MS' },
      { name: 'Morocco', code: 'MA' },
      { name: 'Mozambique', code: 'MZ' },
      { name: 'Myanmar', code: 'MM' },
      { name: 'Namibia', code: 'NA' },
      { name: 'Nauru', code: 'NR' },
      { name: 'Nepal', code: 'NP' },
      { name: 'Netherlands', code: 'NL' },
      { name: 'Netherlands Antilles', code: 'AN' },
      { name: 'New Caledonia', code: 'NC' },
      { name: 'New Zealand', code: 'NZ' },
      { name: 'Nicaragua', code: 'NI' },
      { name: 'Niger', code: 'NE' },
      { name: 'Nigeria', code: 'NG' },
      { name: 'Niue', code: 'NU' },
      { name: 'Norfolk Island', code: 'NF' },
      { name: 'Northern Mariana Islands', code: 'MP' },
      { name: 'Norway', code: 'NO' },
      { name: 'Oman', code: 'OM' },
      { name: 'Pakistan', code: 'PK' },
      { name: 'Palau', code: 'PW' },
      { name: 'Palestinian Territory, Occupied', code: 'PS' },
      { name: 'Panama', code: 'PA' },
      { name: 'Papua New Guinea', code: 'PG' },
      { name: 'Paraguay', code: 'PY' },
      { name: 'Peru', code: 'PE' },
      { name: 'Philippines', code: 'PH' },
      { name: 'Pitcairn', code: 'PN' },
      { name: 'Poland', code: 'PL' },
      { name: 'Portugal', code: 'PT' },
      { name: 'Puerto Rico', code: 'PR' },
      { name: 'Qatar', code: 'QA' },
      { name: 'Reunion', code: 'RE' },
      { name: 'Romania', code: 'RO' },
      { name: 'Russian Federation', code: 'RU' },
      { name: 'RWANDA', code: 'RW' },
      { name: 'Saint Helena', code: 'SH' },
      { name: 'Saint Kitts and Nevis', code: 'KN' },
      { name: 'Saint Lucia', code: 'LC' },
      { name: 'Saint Pierre and Miquelon', code: 'PM' },
      { name: 'Saint Vincent and the Grenadines', code: 'VC' },
      { name: 'Samoa', code: 'WS' },
      { name: 'San Marino', code: 'SM' },
      { name: 'Sao Tome and Principe', code: 'ST' },
      { name: 'Saudi Arabia', code: 'SA' },
      { name: 'Senegal', code: 'SN' },
      { name: 'Serbia and Montenegro', code: 'CS' },
      { name: 'Seychelles', code: 'SC' },
      { name: 'Sierra Leone', code: 'SL' },
      { name: 'Singapore', code: 'SG' },
      { name: 'Slovakia', code: 'SK' },
      { name: 'Slovenia', code: 'SI' },
      { name: 'Solomon Islands', code: 'SB' },
      { name: 'Somalia', code: 'SO' },
      { name: 'South Africa', code: 'ZA' },
      { name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
      { name: 'Spain', code: 'ES' },
      { name: 'Sri Lanka', code: 'LK' },
      { name: 'Sudan', code: 'SD' },
      { name: 'Suriname', code: 'SR' },
      { name: 'Svalbard and Jan Mayen', code: 'SJ' },
      { name: 'Swaziland', code: 'SZ' },
      { name: 'Sweden', code: 'SE' },
      { name: 'Switzerland', code: 'CH' },
      { name: 'Syrian Arab Republic', code: 'SY' },
      { name: 'Taiwan, Province of China', code: 'TW' },
      { name: 'Tajikistan', code: 'TJ' },
      { name: 'Tanzania, United Republic of', code: 'TZ' },
      { name: 'Thailand', code: 'TH' },
      { name: 'Timor-Leste', code: 'TL' },
      { name: 'Togo', code: 'TG' },
      { name: 'Tokelau', code: 'TK' },
      { name: 'Tonga', code: 'TO' },
      { name: 'Trinidad and Tobago', code: 'TT' },
      { name: 'Tunisia', code: 'TN' },
      { name: 'Turkey', code: 'TR' },
      { name: 'Turkmenistan', code: 'TM' },
      { name: 'Turks and Caicos Islands', code: 'TC' },
      { name: 'Tuvalu', code: 'TV' },
      { name: 'Uganda', code: 'UG' },
      { name: 'Ukraine', code: 'UA' },
      { name: 'United Arab Emirates', code: 'AE' },
      { name: 'United Kingdom', code: 'GB' },
      { name: 'United States', code: 'US' },
      { name: 'United States Minor Outlying Islands', code: 'UM' },
      { name: 'Uruguay', code: 'UY' },
      { name: 'Uzbekistan', code: 'UZ' },
      { name: 'Vanuatu', code: 'VU' },
      { name: 'Venezuela', code: 'VE' },
      { name: 'Viet Nam', code: 'VN' },
      { name: 'Virgin Islands, British', code: 'VG' },
      { name: 'Virgin Islands, U.S.', code: 'VI' },
      { name: 'Wallis and Futuna', code: 'WF' },
      { name: 'Western Sahara', code: 'EH' },
      { name: 'Yemen', code: 'YE' },
      { name: 'Zambia', code: 'ZM' },
      { name: 'Zimbabwe', code: 'ZW' }
    ];
    return countries.find(c => c.code.toLowerCase() === code.toLowerCase());
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static buildHmacSha256SignatureWs (parameters: Object) {
    const dataQueryString = qs.stringify(parameters); // .replace("%20", "+");
    return CryptoJS.HmacSHA256(
      dataQueryString,
      config.ws.hmacSecretPacketKeyWs
    ).toString(CryptoJS.enc.Hex);
    // return CryptoJS
    //   .createHmac('sha256', config.ws.hmacSecretPacketKeyWs)
    //   .update(dataQueryString)
    //   .digest('hex');
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static validateHmacSha256SignatureWs (token: string, data: Object) {
    const signature = Utils.buildHmacSha256SignatureWs(data);
    return signature === token;
  }

  static uniqueId (length?: number) {
    const ALPHABET =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    if (!length) {
      length = 9;
    }

    let result = '_';
    for (let i = 0; i < length; i++) {
      result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }

    return result;
  }

  static manageError (errorMessage: ApplicationError) {
    switch (errorMessage.code) {
      case UserErrors.USER_EMAIL_MUST_BE_UNIQUE:
        this.toastError('', Utils.translate('loginPage.errors.emailNotUnique'));
        break;
      case UserErrors.USER_PSEUDO_MUST_BE_UNIQUE:
        this.toastError('', Utils.translate('loginPage.errors.pseudoNotUnique'));
        break;
      case AuthenticationErrors.AUTH_INVALID_CREDENTIALS:
        this.toastError('', Utils.translate('loginPage.errors.invalidCredentials'));
        break;
    }
  }

  static translate (txt: string, params?: object) {
    const { t } = i18n.global;
    txt = t(txt);
    if (params) {
      for (const [key, v] of Object.entries(params)) {
        txt = txt.replaceAll('$' + key + '$', v);
      }
    }
    return txt;
  }

  static debug (variable: any) {
    console.log(variable);
  }

  static async postEncodedToBackend (
    url: string,
    // eslint-disable-next-line @typescript-eslint/ban-types
    params: Object | FormData,
    // eslint-disable-next-line @typescript-eslint/ban-types
    config?: Object,
    isUploadFile?: boolean
  ): Promise<ApplicationResponse<any>> {
    const token = Utils.buildHmacSha256Signature(params);
    if (isUploadFile) {
      return Global.instanceAxios.post(url, params, config);
      // return RequestManager.executePost(
      //   url,
      //   {
      //     token,
      //     data: params
      //   },
      //   config
      // );
    } else {
      const data = {
        data: params,
        token
      };
      return RequestManager.executePost(url, data, config);
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  static buildHmacSha256Signature (parameters: Object) {
    const dataQueryString = qs.stringify(parameters); // .replace("%20", "+");
    return CryptoJS.HmacSHA256(
      dataQueryString,
      config.hmacSecretPacketKey
    ).toString(CryptoJS.enc.Hex);
  }

  static toastError (title: string, description: string, time?: number) {
    createToast({
      title: title,
      description: description
    },
    {
      position: 'bottom-right',
      type: 'danger',
      transition: 'slide',
      showIcon: true,
      toastBackgroundColor: '#AF0404',
      hideProgressBar: true,
      timeout: time
    });
  }

  static toastInfo (title: string, description: string, time?: number, position?: Position) {
    createToast({
      title: title,
      description: description
    },
    {
      position: position ?? 'bottom-center',
      type: 'info',
      transition: 'slide',
      showIcon: true,
      // toastBackgroundColor: '#AF0404',
      hideProgressBar: true,
      timeout: time
    });
  }

  static toastSuccess (title: string, description: string, time?: number) {
    createToast({
      title: title,
      description: description
    },
    {
      position: 'bottom-right',
      type: 'danger',
      transition: 'slide',
      showIcon: true,
      toastBackgroundColor: 'green',
      hideProgressBar: true,
      timeout: time
    });
  }

  // static toastError (vueInstance: Vue, message: string, timestamp?: number) {
  //   vueInstance.$buefy.toast.open({
  //     duration: timestamp || 5000,
  //     message: message,
  //     queue: false,
  //     position: 'is-bottom',
  //     type: 'is-danger'
  //   });
  // }

  /**
   * Gestion des erreurs provenant du proxy ou du backend.
   * @param vueInstance -  Vue dans laquelle l'erreur doit s'afficher.
   * @param error - Erreur renvoyée par le proxy ou le backend.
   */
  // static handleApplicationError(vueInstance: Vue, error: ApplicationError) {
  //   let message = null;
  //   let type = "is-danger";
  //   let duration = 7000;
  //
  //   switch (error.code) {
  //     case ClientErrors.BACKEND_ERROR:
  //     case ClientErrors.BACKEND_NOT_RESPONDING:
  //     case ClientErrors.BACKEND_GENERAL_ERROR:
  //       Utils.handleApplicationError(vueInstance, error.details.error);
  //       break;
  //     case UserErrors.ERROR_WHILE_SEARCHING_USER_IN_DATABASE:
  //     case AuthenticationErrors.AUTH_INVALID_CREDENTIALS:
  //       message = I18n.t("userErrors.errorsFromBackend.wrongAccess") as string;
  //       type = "is-warning";
  //       break;
  //     case AuthenticationErrors.AUTH_TOKEN_EXPIRED:
  //       message = I18n.t(
  //         "userErrors.errorsFromBackend.expiredSession"
  //       ) as string;
  //       type = "is-warning";
  //       duration = 30000;
  //       vueInstance.$store.dispatch("logout").then(() => {
  //         vueInstance.$router.push({ name: "login" }).catch(() => {
  //           Utils.toastError(
  //             vueInstance,
  //             I18n.t("userErrors.disconnectError") as string
  //           );
  //         });
  //       });
  //       break;
  //     case AuthenticationErrors.AUTH_ACCESS_TO_INTRANET_NOT_ALLOWED:
  //       message = I18n.t("userErrors.errorsFromBackend.noAccess") as string;
  //       type = "is-warning";
  //       duration = 15000;
  //       break;
  //     case AuthenticationErrors.AUTH_DISABLED_ACCOUNT:
  //       message = I18n.t(
  //         "userErrors.errorsFromBackend.accountDisabled"
  //       ) as string;
  //       type = "is-warning";
  //       duration = 15000;
  //       break;
  //     case AuthenticationErrors.AUTH_NO_ROLE_ALLOWED:
  //       message = I18n.t(
  //         "userErrors.errorsFromBackend.noRoleAllowed"
  //       ) as string;
  //       type = "is-warning";
  //       duration = 15000;
  //       break;
  //     case ClientErrors.PROXY_UNKNOWN_ERROR:
  //       message = "ApplicationErrorType.PROXY_UNKNOWN_ERROR";
  //       break;
  //     case AuthenticationErrors.AUTH_NO_TOKEN_PROVIDED:
  //       message = "ApplicationErrorType.AUTH_NO_TOKEN_PROVIDED";
  //       break;
  //     case AuthenticationErrors.AUTH_TOKEN_IS_NOT_AUTHENTIC:
  //       message = "ApplicationErrorType.AUTH_TOKEN_IS_NOT_AUTHENTIC";
  //       break;
  //     case AuthenticationErrors.ACCESS_NOT_AUTHORIZED:
  //       message = I18n.t(
  //         "userErrors.errorsFromBackend.functionNotAllowed"
  //       ) as string;
  //       type = "is-warning";
  //       duration = 15000;
  //       break;
  //     case ClientErrors.AXIOS_NO_RESPONSE:
  //       message = I18n.t(
  //         "userErrors.errorsFromBackend.serverNotResponding"
  //       ) as string;
  //       break;
  //     case UserErrors.ERROR_WHILE_SETUP_NEW_PASSWORD:
  //     case UserErrors.ERROR_WHILE_UPDATING_NEW_PASSWORD:
  //       message = I18n.t(
  //         "userErrors.errorsFromBackend.passwordUpdateFailed"
  //       ) as string;
  //       break;
  //     case UserErrors.ERROR_WHILE_CREATING_USER_IN_LDAP:
  //       duration = 30000;
  //       message =
  //         "<p>" +
  //         I18n.t("userErrors.errorsFromBackend.ldapError") +
  //         "<ul style='list-style-type: circle; padding-left: 25px'>" +
  //         "<li>" +
  //         I18n.t("userErrors.errorsFromBackend.ldapPasswordError") +
  //         "</li>" +
  //         "</ul>" +
  //         I18n.t("userErrors.errorsFromBackend.contactSupport") +
  //         "</p>";
  //       break;
  //
  //     case GeneralErrors.URL_CANT_BE_LOADED:
  //       message = I18n.t(
  //         "layoutPCP.pages.webTemplates.errors.urlNotFound"
  //       ) as string;
  //       break;
  //     case GeneralErrors.TEMPLATE_PREVIEW_NOT_FOUND:
  //       message = I18n.t(
  //         "layoutPCP.pages.webTemplates.errors.templatePreview"
  //       ) as string;
  //       break;
  //     case GeneralErrors.CAMPAIGN_NOT_AUTHORIZED:
  //       message = I18n.t(
  //         "layoutPCP.pages.campaignResult.error.authorized"
  //       ) as string;
  //       break;
  //     //Erreurs traitées dans l'interface directement
  //     case UserErrors.ERROR_WHILE_VALIDATING_NEW_PASSWORD:
  //     case UserErrors.ERROR_WHILE_VALIDATING_USER:
  //       break;
  //     case WebUserErrors.USER_MUST_BE_DISABLED_TWO_FA:
  //       message = I18n.t(
  //         "layoutPCP.pages.mgmtUsers.activeMysl.errors.alreadyActive"
  //       ) as string;
  //       type = "is-danger";
  //       break;
  //     case GeneralErrors.UNHANDLED_ERROR:
  //     default:
  //       message = I18n.t("userErrors.errorsFromBackend.unknownError") as string;
  //   }
  //
  //   if (message) {
  //     vueInstance.$buefy.toast.open({
  //       duration,
  //       message: message,
  //       position: "is-bottom",
  //       type: type,
  //       queue: false,
  //     });
  //   }
  // }

  static ucFirst (string: string) {
    if (!string) {
      return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  static removeUnsupportedCharacters (string: string) {
    if (!string) {
      return string;
    }
    return string
      .normalize('NFD')
      .replace(',', '')
      .replace(/\s/g, '')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  static isPasswordValid (password: string) {
    // mot de passe complexe ==> (?=.*?[!@#/\\\-_+$&*~])
    // eslint-disable-next-line prefer-regex-literals
    const regexPassword = new RegExp(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/
    );
    return regexPassword.test(password);
  }

  static isEmailValid (email: string) {
    // eslint-disable-next-line prefer-regex-literals
    const regexEmail = new RegExp(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regexEmail.test(email);
  }

  static async createTimeOut (ms: number) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(true);
      }, ms);
    });
  }

  static getFakeCardsToDistribute () {
    const cards: {top: string; left: string}[] = [];
    for (let i = 0; i < 36; i++) {
      const v = i * 0.25 - 4;
      const top = 'top: calc(50% - ' + v + 'px);';
      cards.push({
        top,
        left: 'left: calc(50% - ' + v + 'px);'
      });
    }
    return cards;
  }
  //
  // static isPhoneNumberValid (phoneNumber: string) {
  //   const regexPhoneNumber = new RegExp(
  //     /(\b(0041|0)|\B\+41)(\s?\(0\))?(\s)?[1-9]{2}(\s)?[0-9]{3}(\s)?[0-9]{2}(\s)?[0-9]{2}\b/
  //   );
  //   return regexPhoneNumber.test(phoneNumber);
  // }
}
