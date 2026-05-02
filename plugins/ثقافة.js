import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { kiraTengenConfig, addExpFromGame } from './theme.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let timeout = 60000;
let poin = 1000;

if (!global.games) {
    global.games = {};
}

// ⭐⭐⭐ قائمة أسئلة ثقافية موسعة جداً (أكثر من 200 سؤال) ⭐⭐⭐
const ARABIC_TRIVIA_QUESTIONS = [
    // علوم (40 سؤال)
    {
        question: "ما هو الكوكب الأقرب إلى الشمس؟",
        correctAnswer: "عطارد",
        incorrectAnswers: ["المريخ", "الزهرة", "المشتري"]
    },
    {
        question: "كم عدد ألوان قوس قزح؟",
        correctAnswer: "سبعة",
        incorrectAnswers: ["خمسة", "ستة", "ثمانية"]
    },
    {
        question: "ما هو الغاز الأكثر وفرة في الغلاف الجوي للأرض؟",
        correctAnswer: "النيتروجين",
        incorrectAnswers: ["الأكسجين", "ثاني أكسيد الكربون", "الهيدروجين"]
    },
    {
        question: "ما هو أسرع حيوان بري في العالم؟",
        correctAnswer: "الفهد",
        incorrectAnswers: ["الأسد", "النمر", "الغزال"]
    },
    {
        question: "كم عدد عظام جسم الإنسان البالغ؟",
        correctAnswer: "206",
        incorrectAnswers: ["200", "210", "215"]
    },
    {
        question: "ما هو العنصر الكيميائي الذي رمزه 'O'؟",
        correctAnswer: "الأكسجين",
        incorrectAnswers: ["الذهب", "الفضة", "الحديد"]
    },
    {
        question: "ما هو أطول نهر في أفريقيا؟",
        correctAnswer: "النيل",
        incorrectAnswers: ["الكونغو", "النيجر", "الزامبيزي"]
    },
    {
        question: "ما هو الكوكب المعروف بالكوكب الأحمر؟",
        correctAnswer: "المريخ",
        incorrectAnswers: ["المشتري", "الزهرة", "زحل"]
    },
    {
        question: "ما هو أقوى عظم في جسم الإنسان؟",
        correctAnswer: "عظم الفخذ",
        incorrectAnswers: ["عظم الذراع", "عظم الجمجمة", "عظم الظهر"]
    },
    {
        question: "ما هو الغاز الذي تحتاجه النباتات للقيام بعملية البناء الضوئي؟",
        correctAnswer: "ثاني أكسيد الكربون",
        incorrectAnswers: ["الأكسجين", "النيتروجين", "الهيدروجين"]
    },
    {
        question: "ما هو أسرع حيوان بحري؟",
        correctAnswer: "سمك المرلين",
        incorrectAnswers: ["الدلفين", "الحوت", "سمك القرش"]
    },
    {
        question: "كم عدد قلوب الأخطبوط؟",
        correctAnswer: "3",
        incorrectAnswers: ["1", "2", "4"]
    },
    {
        question: "ما هو المعدن السائل في درجة حرارة الغرفة؟",
        correctAnswer: "الزئبق",
        incorrectAnswers: ["الذهب", "الفضة", "النحاس"]
    },
    {
        question: "ما هو أضخم كائن حي على الأرض؟",
        correctAnswer: "الحوت الأزرق",
        incorrectAnswers: ["الفيل", "الحوت القاتل", "الديناصور"]
    },
    {
        question: "ما هو الغاز المسؤول عن ثقب الأوزون؟",
        correctAnswer: "الكلوروفلوروكربون",
        incorrectAnswers: ["ثاني أكسيد الكربون", "الميثان", "الأكسجين"]
    },
    {
        question: "كم عدد أذرع نجم البحر؟",
        correctAnswer: "5",
        incorrectAnswers: ["4", "6", "8"]
    },
    {
        question: "ما هو أصلع أنواع الحيوانات؟",
        correctAnswer: "الفأر العاري",
        incorrectAnswers: ["الفيل", "الزرافة", "الكنغر"]
    },
    {
        question: "ما هو المعدن الأكثر توصيلاً للكهرباء؟",
        correctAnswer: "الفضة",
        incorrectAnswers: ["النحاس", "الذهب", "الألمنيوم"]
    },
    {
        question: "كم عدد الكروموسومات في الإنسان؟",
        correctAnswer: "46",
        incorrectAnswers: ["44", "48", "50"]
    },
    {
        question: "ما هو أطول نهر في آسيا؟",
        correctAnswer: "يانغتسي",
        incorrectAnswers: ["النهر الأصفر", "الميكونغ", "الغانج"]
    },
    {
        question: "ما هو العنصر الأكثر وفرة في الكون؟",
        correctAnswer: "الهيدروجين",
        incorrectAnswers: ["الهيليوم", "الأكسجين", "الكربون"]
    },
    {
        question: "ما هو أسرع طائر في العالم؟",
        correctAnswer: "الشاهين",
        incorrectAnswers: ["النسر", "الصقر", "البلبل"]
    },
    {
        question: "كم عدد أحرف اللغة العربية؟",
        correctAnswer: "28",
        incorrectAnswers: ["26", "29", "30"]
    },
    {
        question: "ما هو أقدم حيوان على الأرض؟",
        correctAnswer: "قنديل البحر",
        incorrectAnswers: ["التمساح", "السلحفاة", "الحوت"]
    },
    {
        question: "ما هو المعدن الأثقل؟",
        correctAnswer: "الأوزميوم",
        incorrectAnswers: ["الذهب", "البلاتين", "الرصاص"]
    },
    {
        question: "كم عدد فقرات عنق الزرافة؟",
        correctAnswer: "7",
        incorrectAnswers: ["5", "9", "12"]
    },
    {
        question: "ما هو الكوكب الأكبر في المجموعة الشمسية؟",
        correctAnswer: "المشتري",
        incorrectAnswers: ["زحل", "نبتون", "أورانوس"]
    },
    {
        question: "ما هو أطول نهر في أوروبا؟",
        correctAnswer: "الفولغا",
        incorrectAnswers: ["الدانوب", "الراين", "السينا"]
    },
    {
        question: "كم عدد العضلات في جسم الإنسان؟",
        correctAnswer: "600",
        incorrectAnswers: ["400", "500", "700"]
    },
    {
        question: "ما هو العنصر الكيميائي الذي رمزه 'Au'؟",
        correctAnswer: "الذهب",
        incorrectAnswers: ["الفضة", "الألمنيوم", "الحديد"]
    },
    {
        question: "ما هو أضخم بركان في العالم؟",
        correctAnswer: "مونا لوا",
        incorrectAnswers: ["فيزوف", "إتنا", "كراكاتوا"]
    },
    {
        question: "كم عدد أسنان القرش؟",
        correctAnswer: "3000",
        incorrectAnswers: ["1000", "2000", "4000"]
    },
    {
        question: "ما هو المعدن الذي يستخدم في صناعة الطائرات؟",
        correctAnswer: "الألمنيوم",
        incorrectAnswers: ["الحديد", "النحاس", "الفضة"]
    },
    {
        question: "ما هو أطول نهر في أمريكا الجنوبية؟",
        correctAnswer: "الأمازون",
        incorrectAnswers: ["البارانا", "الأورينوكو", "الريو غراندي"]
    },
    {
        question: "كم عدد حجرات القلب؟",
        correctAnswer: "4",
        incorrectAnswers: ["2", "3", "5"]
    },
    {
        question: "ما هو الغاز المسؤول عن الاحتباس الحراري؟",
        correctAnswer: "ثاني أكسيد الكربون",
        incorrectAnswers: ["الأكسجين", "النيتروجين", "الهيدروجين"]
    },
    {
        question: "ما هو أسرع حيوان في الماء؟",
        correctAnswer: "سمك الشراع",
        incorrectAnswers: ["الدلفين", "الحوت", "سمك التونة"]
    },
    {
        question: "كم عدد عيون النحلة؟",
        correctAnswer: "5",
        incorrectAnswers: ["2", "3", "4"]
    },
    {
        question: "ما هو المعدن المستخدم في صناعة البطاريات؟",
        correctAnswer: "الليثيوم",
        incorrectAnswers: ["الحديد", "النحاس", "الفضة"]
    },

    // جغرافيا (40 سؤال)
    {
        question: "ما هو أكبر محيط في العالم؟",
        correctAnswer: "المحيط الهادئ",
        incorrectAnswers: ["المحيط الأطلسي", "المحيط الهندي", "المحيط المتجمد الشمالي"]
    },
    {
        question: "ما هي أكبر دولة في العالم من حيث المساحة؟",
        correctAnswer: "روسيا",
        incorrectAnswers: ["كندا", "الصين", "الولايات المتحدة"]
    },
    {
        question: "ما هي أعلى قمة جبل في العالم؟",
        correctAnswer: "إفرست",
        incorrectAnswers: ["كي 2", "كانغشينجونغا", "لوتسي"]
    },
    {
        question: "ما هي أطول نهر في العالم؟",
        correctAnswer: "النيل",
        incorrectAnswers: ["الأمازون", "الميسيسيبي", "الدانوب"]
    },
    {
        question: "ما هي أكبر صحراء في العالم؟",
        correctAnswer: "الصحراء الكبرى",
        incorrectAnswers: ["صحراء غوبي", "صحراء الربع الخالي", "صحراء كالاهاري"]
    },
    {
        question: "ما هي عاصمة أستراليا؟",
        correctAnswer: "كانبرا",
        incorrectAnswers: ["سيدني", "ملبورن", "بريزبان"]
    },
    {
        question: "ما هي أكبر جزيرة في العالم؟",
        correctAnswer: "جرينلاند",
        incorrectAnswers: ["مدغشقر", "بورنيو", "بابوا غينيا الجديدة"]
    },
    {
        question: "ما هي أصغر دولة في العالم؟",
        correctAnswer: "الفاتيكان",
        incorrectAnswers: ["موناكو", "ناورو", "توفالو"]
    },
    {
        question: "ما هي الدولة التي تسمى بلاد الشمس المشرقة؟",
        correctAnswer: "اليابان",
        incorrectAnswers: ["الصين", "كوريا", "تايلاند"]
    },
    {
        question: "ما هي عاصمة كندا؟",
        correctAnswer: "أوتاوا",
        incorrectAnswers: ["تورونتو", "فانكوفر", "مونتريال"]
    },
    {
        question: "ما هي أكبر مدينة في العالم من حيث السكان؟",
        correctAnswer: "طوكيو",
        incorrectAnswers: ["شنغهاي", "مومباي", "مكسيكو سيتي"]
    },
    {
        question: "ما هي الدولة التي تحتوي على أكبر عدد من الجزر؟",
        correctAnswer: "السويد",
        incorrectAnswers: ["إندونيسيا", "الفلبين", "اليونان"]
    },
    {
        question: "ما هي عاصمة البرازيل؟",
        correctAnswer: "برازيليا",
        incorrectAnswers: ["ريو دي جانيرو", "ساو باولو", "سالفادور"]
    },
    {
        question: "ما هي أعلى شلالات في العالم؟",
        correctAnswer: "شلالات آنجل",
        incorrectAnswers: ["شلالات نياجرا", "شلالات فيكتوريا", "شلالات إغوازو"]
    },
    {
        question: "ما هي الدولة التي تسمى أرض الفيلة؟",
        correctAnswer: "تايلاند",
        incorrectAnswers: ["الهند", "سريلانكا", "كمبوديا"]
    },
    {
        question: "ما هي عاصمة جنوب أفريقيا؟",
        correctAnswer: "بريتوريا",
        incorrectAnswers: ["جوهانسبرغ", "كيب تاون", "ديربان"]
    },
    {
        question: "ما هي أكبر بحيرة في العالم؟",
        correctAnswer: "بحر قزوين",
        incorrectAnswers: ["البحيرة العليا", "بحيرة فكتوريا", "بحيرة بايكال"]
    },
    {
        question: "ما هي الدولة التي تحتوي على أكبر عدد من البحيرات؟",
        correctAnswer: "كندا",
        incorrectAnswers: ["روسيا", "الولايات المتحدة", "فنلندا"]
    },
    {
        question: "ما هي عاصمة مصر؟",
        correctAnswer: "القاهرة",
        incorrectAnswers: ["الإسكندرية", "الجيزة", "بورسعيد"]
    },
    {
        question: "ما هي الدولة التي تسمى بلاد الألف بحيرة؟",
        correctAnswer: "فنلندا",
        incorrectAnswers: ["السويد", "النرويج", "كندا"]
    },
    {
        question: "ما هي عاصمة فرنسا؟",
        correctAnswer: "باريس",
        incorrectAnswers: ["ليون", "مارسيليا", "تولوز"]
    },
    {
        question: "ما هي أكبر دولة عربية من حيث المساحة؟",
        correctAnswer: "الجزائر",
        incorrectAnswers: ["السعودية", "ليبيا", "مصر"]
    },
    {
        question: "ما هي عاصمة الصين؟",
        correctAnswer: "بكين",
        incorrectAnswers: ["شنغهاي", "غوانغتشو", "شينزن"]
    },
    {
        question: "ما هي الدولة التي تسمى بلاد التبت؟",
        correctAnswer: "نيبال",
        incorrectAnswers: ["بوتان", "الهند", "باكستان"]
    },
    {
        question: "ما هي عاصمة الهند؟",
        correctAnswer: "نيودلهي",
        incorrectAnswers: ["مومباي", "كلكتا", "بنغالور"]
    },
    {
        question: "ما هي أكبر صحراء في آسيا؟",
        correctAnswer: "صحراء غوبي",
        incorrectAnswers: ["صحراء الربع الخالي", "صحراء كاراكوم", "صحراء كيزيل كوم"]
    },
    {
        question: "ما هي عاصمة إيطاليا؟",
        correctAnswer: "روما",
        incorrectAnswers: ["ميلانو", "فلورنسا", "البندقية"]
    },
    {
        question: "ما هي الدولة التي تسمى أرض النخيل؟",
        correctAnswer: "السعودية",
        incorrectAnswers: ["الإمارات", "قطر", "عمان"]
    },
    {
        question: "ما هي عاصمة تركيا؟",
        correctAnswer: "أنقرة",
        incorrectAnswers: ["إسطنبول", "أزمير", "بورصة"]
    },
    {
        question: "ما هي أكبر دولة في أفريقيا من حيث المساحة؟",
        correctAnswer: "الجزائر",
        incorrectAnswers: ["الكونغو", "السودان", "ليبيا"]
    },
    {
        question: "ما هي عاصمة ألمانيا؟",
        correctAnswer: "برلين",
        incorrectAnswers: ["هامبورغ", "ميونخ", "فرانكفورت"]
    },
    {
        question: "ما هي الدولة التي تسمى بلاد الأرز؟",
        correctAnswer: "لبنان",
        incorrectAnswers: ["سوريا", "الأردن", "فلسطين"]
    },
    {
        question: "ما هي عاصمة الأرجنتين؟",
        correctAnswer: "بوينس آيرس",
        incorrectAnswers: ["قرطبة", "روساريو", "مندوزا"]
    },
    {
        question: "ما هي أكبر جزيرة في البحر المتوسط؟",
        correctAnswer: "صقلية",
        incorrectAnswers: ["سردينيا", "قبرص", "كريت"]
    },
    {
        question: "ما هي عاصمة اليونان؟",
        correctAnswer: "أثينا",
        incorrectAnswers: ["سالونيك", "باتراس", "هراكليون"]
    },
    {
        question: "ما هي الدولة التي تسمى بلاد العم سام؟",
        correctAnswer: "الولايات المتحدة",
        incorrectAnswers: ["كندا", "بريطانيا", "أستراليا"]
    },
    {
        question: "ما هي عاصمة البرتغال؟",
        correctAnswer: "لشبونة",
        incorrectAnswers: ["بورتو", "كاشكايش", "براغا"]
    },
    {
        question: "ما هي أكبر دولة في أمريكا الجنوبية؟",
        correctAnswer: "البرازيل",
        incorrectAnswers: ["الأرجنتين", "بيرو", "كولومبيا"]
    },
    {
        question: "ما هي عاصمة هولندا؟",
        correctAnswer: "أمستردام",
        incorrectAnswers: ["روتردام", "لاهاي", "أوترخت"]
    },

    // أدب وثقافة (40 سؤال)
    {
        question: "من هو مؤلف رواية 'الأمير الصغير'؟",
        correctAnswer: "أنطوان دو سانت إكزوبيري",
        incorrectAnswers: ["ألبير كامو", "فيكتور هوجو", "جبران خليل جبران"]
    },
    {
        question: "من هو مؤلف كتاب 'كليلة ودمنة'؟",
        correctAnswer: "ابن المقفع",
        incorrectAnswers: ["الجاحظ", "أبو حيان التوحيدي", "الهمذاني"]
    },
    {
        question: "ما هي اللغة الرسمية في البرازيل؟",
        correctAnswer: "البرتغالية",
        incorrectAnswers: ["الإسبانية", "الإنجليزية", "الفرنسية"]
    },
    {
        question: "من هو شاعر الرسول صلى الله عليه وسلم؟",
        correctAnswer: "حسان بن ثابت",
        incorrectAnswers: ["كعب بن زهير", "عبد الله بن رواحة", "أبو طالب"]
    },
    {
        question: "ما هي أقدم جامعة في العالم؟",
        correctAnswer: "جامعة القرويين",
        incorrectAnswers: ["جامعة الأزهر", "جامعة بولونيا", "جامعة أكسفورد"]
    },
    {
        question: "من هو مؤلف كتاب 'ديوان المتنبي'؟",
        correctAnswer: "المتنبي",
        incorrectAnswers: ["أبو تمام", "البحتري", "أبو نواس"]
    },
    {
        question: "ما هي اللغة الرسمية في الأرجنتين؟",
        correctAnswer: "الإسبانية",
        incorrectAnswers: ["البرتغالية", "الإنجليزية", "الفرنسية"]
    },
    {
        question: "من هو مؤلف مسرحية 'هملت'؟",
        correctAnswer: "شكسبير",
        incorrectAnswers: ["تشيخوف", "إبسن", "برنارد شو"]
    },
    {
        question: "ما هي لغة النمسا الرسمية؟",
        correctAnswer: "الألمانية",
        incorrectAnswers: ["الإنجليزية", "الفرنسية", "الإيطالية"]
    },
    {
        question: "من هو مؤلف كتاب 'الأغاني'؟",
        correctAnswer: "الأصفهاني",
        incorrectAnswers: ["الجاحظ", "الطبري", "المسعودي"]
    },
    {
        question: "ما هي اللغة الرسمية في سويسرا؟",
        correctAnswer: "الألمانية والفرنسية والإيطالية",
        incorrectAnswers: ["الإنجليزية فقط", "الإسبانية فقط", "البرتغالية فقط"]
    },
    {
        question: "من هو مؤلف رواية 'البؤساء'؟",
        correctAnswer: "فيكتور هوجو",
        incorrectAnswers: ["ألكسندر دوما", "إميل زولا", "غي دو موباسان"]
    },
    {
        question: "ما هي لغة الفلبين الرسمية؟",
        correctAnswer: "التاغالوغية",
        incorrectAnswers: ["الإنجليزية", "الإسبانية", "الفرنسية"]
    },
    {
        question: "من هو مؤلف كتاب 'طوق الحمامة'؟",
        correctAnswer: "ابن حزم",
        incorrectAnswers: ["ابن رشد", "ابن سينا", "ابن خلدون"]
    },
    {
        question: "ما هي اللغة الرسمية في بلجيكا؟",
        correctAnswer: "الهولندية والفرنسية",
        incorrectAnswers: ["الإنجليزية فقط", "الألمانية فقط", "الإسبانية فقط"]
    },
    {
        question: "من هو مؤلف رواية 'الجريمة والعقاب'؟",
        correctAnswer: "دوستويفسكي",
        incorrectAnswers: ["تولستوي", "غوغول", "تشيخوف"]
    },
    {
        question: "ما هي لغة إيران الرسمية؟",
        correctAnswer: "الفارسية",
        incorrectAnswers: ["العربية", "التركية", "الكردية"]
    },
    {
        question: "من هو مؤلف كتاب 'مقدمة ابن خلدون'؟",
        correctAnswer: "ابن خلدون",
        incorrectAnswers: ["الماوردي", "الغزالي", "الطبري"]
    },
    {
        question: "ما هي اللغة الرسمية في النرويج؟",
        correctAnswer: "النرويجية",
        incorrectAnswers: ["السويدية", "الدنماركية", "الإنجليزية"]
    },
    {
        question: "من هو مؤلف رواية '1984'؟",
        correctAnswer: "جورج أورويل",
        incorrectAnswers: ["ألدوس هكسلي", "راى برادبري", "إرنست همنغواي"]
    },
    {
        question: "ما هي لغة باكستان الرسمية؟",
        correctAnswer: "الأردية",
        incorrectAnswers: ["العربية", "الفارسية", "الهندية"]
    },
    {
        question: "من هو مؤلف كتاب 'حي بن يقظان'؟",
        correctAnswer: "ابن طفيل",
        incorrectAnswers: ["ابن سينا", "الفارابي", "ابن رشد"]
    },
    {
        question: "ما هي اللغة الرسمية في الدنمارك؟",
        correctAnswer: "الدنماركية",
        incorrectAnswers: ["النرويجية", "السويدية", "الألمانية"]
    },
    {
        question: "من هو مؤلف رواية 'الغريب'؟",
        correctAnswer: "ألبير كامو",
        incorrectAnswers: ["جان بول سارتر", "فيكتور هوجو", "أونوريه دي بلزاك"]
    },
    {
        question: "ما هي لغة ماليزيا الرسمية؟",
        correctAnswer: "الماليزية",
        incorrectAnswers: ["الإنجليزية", "الصينية", "التايلاندية"]
    },
    {
        question: "من هو مؤلف كتاب 'إحياء علوم الدين'؟",
        correctAnswer: "الغزالي",
        incorrectAnswers: ["ابن تيمية", "ابن القيم", "الماوردي"]
    },
    {
        question: "ما هي اللغة الرسمية في فنلندا؟",
        correctAnswer: "الفنلندية",
        incorrectAnswers: ["السويدية", "النرويجية", "الدنماركية"]
    },
    {
        question: "من هو مؤلف رواية 'الأيام'؟",
        correctAnswer: "طه حسين",
        incorrectAnswers: ["توفيق الحكيم", "نجيب محفوظ", "يوسف إدريس"]
    },
    {
        question: "ما هي لغة إندونيسيا الرسمية؟",
        correctAnswer: "الإندونيسية",
        incorrectAnswers: ["الماليزية", "الهولندية", "الإنجليزية"]
    },
    {
        question: "من هو مؤلف كتاب 'المنتظم في التاريخ'؟",
        correctAnswer: "ابن الجوزي",
        incorrectAnswers: ["الطبري", "المسعودي", "ابن الأثير"]
    },
    {
        question: "ما هي اللغة الرسمية في المجر؟",
        correctAnswer: "المجرية",
        incorrectAnswers: ["الرومانية", "السلوفاكية", "النمساوية"]
    },
    {
        question: "من هو مؤلف رواية 'زقاق المدق'؟",
        correctAnswer: "نجيب محفوظ",
        incorrectAnswers: ["يوسف إدريس", "يحيى حقي", "توفيق الحكيم"]
    },
    {
        question: "ما هي لغة التشيك الرسمية؟",
        correctAnswer: "التشيكية",
        incorrectAnswers: ["السلوفاكية", "البولندية", "الألمانية"]
    },
    {
        question: "من هو مؤلف كتاب 'العقد الفريد'؟",
        correctAnswer: "ابن عبد ربه",
        incorrectAnswers: ["الجاحظ", "ابن قتيبة", "المبرد"]
    },
    {
        question: "ما هي اللغة الرسمية في بولندا؟",
        correctAnswer: "البولندية",
        incorrectAnswers: ["الروسية", "الألمانية", "التشيكية"]
    },
    {
        question: "من هو مؤلف رواية 'الحرافيش'؟",
        correctAnswer: "نجيب محفوظ",
        incorrectAnswers: ["يوسف إدريس", "يحيى حقي", "توفيق الحكيم"]
    },
    {
        question: "ما هي لغة رومانيا الرسمية؟",
        correctAnswer: "الرومانية",
        incorrectAnswers: ["البلغارية", "المجرية", "الصربية"]
    },
    {
        question: "من هو مؤلف كتاب 'وفيات الأعيان'؟",
        correctAnswer: "ابن خلكان",
        incorrectAnswers: ["الذهبي", "الصفدي", "ابن كثير"]
    },
    {
        question: "ما هي اللغة الرسمية في بلغاريا؟",
        correctAnswer: "البلغارية",
        incorrectAnswers: ["الرومانية", "الصربية", "اليونانية"]
    },
    {
        question: "من هو مؤلف رواية 'قنديل أم هاشم'؟",
        correctAnswer: "يحيى حقي",
        incorrectAnswers: ["نجيب محفوظ", "يوسف إدريس", "توفيق الحكيم"]
    },
    {
        question: "ما هي اللغة الرسمية في اليونان؟",
        correctAnswer: "اليونانية",
        incorrectAnswers: ["التركية", "البولندية", "الإيطالية"]
    },

    // تاريخ (40 سؤال)
    {
        question: "في أي عام وقعت الحرب العالمية الأولى؟",
        correctAnswer: "1914",
        incorrectAnswers: ["1912", "1916", "1918"]
    },
    {
        question: "من هو أول خليفة في الإسلام؟",
        correctAnswer: "أبو بكر الصديق",
        incorrectAnswers: ["عمر بن الخطاب", "عثمان بن عفان", "علي بن أبي طالب"]
    },
    {
        question: "ما هي أقدم حضارة في العالم؟",
        correctAnswer: "الحضارة السومرية",
        incorrectAnswers: ["الحضارة المصرية", "الحضارة الصينية", "الحضارة الهندية"]
    },
    {
        question: "من هو مكتشف أمريكا؟",
        correctAnswer: "كريستوفر كولومبوس",
        incorrectAnswers: ["فاسكو دي غاما", "أميريغو فسبوتشي", "ماجلان"]
    },
    {
        question: "في أي عام سقطت الأندلس؟",
        correctAnswer: "1492",
        incorrectAnswers: ["1485", "1500", "1510"]
    },
    {
        question: "من هو مؤسس الدولة العباسية؟",
        correctAnswer: "أبو العباس السفاح",
        incorrectAnswers: ["أبو جعفر المنصور", "هارون الرشيد", "المأمون"]
    },
    {
        question: "في أي عام وقعت الحرب العالمية الثانية؟",
        correctAnswer: "1939",
        incorrectAnswers: ["1937", "1941", "1945"]
    },
    {
        question: "من هو قائد معركة القادسية؟",
        correctAnswer: "سعد بن أبي وقاص",
        incorrectAnswers: ["خالد بن الوليد", "عمرو بن العاص", "المثنى بن حارثة"]
    },
    {
        question: "ما هي أقدم مدينة في العالم؟",
        correctAnswer: "أريحا",
        incorrectAnswers: ["دمشق", "بغداد", "القاهرة"]
    },
    {
        question: "من هو مؤسس الدولة الأموية؟",
        correctAnswer: "معاوية بن أبي سفيان",
        incorrectAnswers: ["عبد الملك بن مروان", "الوليد بن عبد الملك", "يزيد بن معاوية"]
    },
    {
        question: "في أي عام وقعت حرب أكتوبر؟",
        correctAnswer: "1973",
        incorrectAnswers: ["1967", "1970", "1975"]
    },
    {
        question: "من هو قائد معركة اليرموك؟",
        correctAnswer: "خالد بن الوليد",
        incorrectAnswers: ["سعد بن أبي وقاص", "عمرو بن العاص", "أبو عبيدة بن الجراح"]
    },
    {
        question: "ما هي أقدم مملكة في التاريخ؟",
        correctAnswer: "مملكة أكد",
        incorrectAnswers: ["مملكة مصر", "مملكة آشور", "مملكة بابل"]
    },
    {
        question: "من هو مؤسس الدولة العثمانية؟",
        correctAnswer: "عثمان بن أرطغرل",
        incorrectAnswers: ["محمد الفاتح", "سليمان القانوني", "بايزيد الأول"]
    },
    {
        question: "في أي عام وقعت الثورة الفرنسية؟",
        correctAnswer: "1789",
        incorrectAnswers: ["1776", "1792", "1804"]
    },
    {
        question: "من هو قائد معركة حطين؟",
        correctAnswer: "صلاح الدين الأيوبي",
        incorrectAnswers: ["نور الدين زنكي", "المعز لدين الله", "الأشرف خليل"]
    },
    {
        question: "ما هي أقدم إمبراطورية في التاريخ؟",
        correctAnswer: "الإمبراطورية الآشورية",
        incorrectAnswers: ["الإمبراطورية الرومانية", "الإمبراطورية الفارسية", "الإمبراطورية المصرية"]
    },
    {
        question: "من هو مؤسس مدينة بغداد؟",
        correctAnswer: "أبو جعفر المنصور",
        incorrectAnswers: ["هارون الرشيد", "المأمون", "المعتصم"]
    },
    {
        question: "في أي عام وقعت الثورة الأمريكية؟",
        correctAnswer: "1776",
        incorrectAnswers: ["1789", "1765", "1790"]
    },
    {
        question: "من هو قائد معركة عين جالوت؟",
        correctAnswer: "سيف الدين قطز",
        incorrectAnswers: ["الظاهر بيبرس", "الناصر محمد", "الأشرف خليل"]
    },
    {
        question: "ما هي أقدم مملكة عربية؟",
        correctAnswer: "مملكة معين",
        incorrectAnswers: ["مملكة سبأ", "مملكة حمير", "مملكة كندة"]
    },
    {
        question: "من هو مؤسس الدولة الفاطمية؟",
        correctAnswer: "عبيد الله المهدي",
        incorrectAnswers: ["المعز لدين الله", "العزيز بالله", "الحاكم بأمر الله"]
    },
    {
        question: "في أي عام وقعت الثورة البلشفية؟",
        correctAnswer: "1917",
        incorrectAnswers: ["1914", "1918", "1920"]
    },
    {
        question: "من هو قائد معركة ذات الصواري؟",
        correctAnswer: "عبد الله بن أبي السرح",
        incorrectAnswers: ["عمرو بن العاص", "معاوية بن أبي سفيان", "خالد بن الوليد"]
    },
    {
        question: "ما هي أقدم حضارة في أمريكا؟",
        correctAnswer: "حضارة الأولمك",
        incorrectAnswers: ["حضارة المايا", "حضارة الأزتك", "حضارة الإنكا"]
    },
    {
        question: "من هو مؤسس الدولة السلجوقية؟",
        correctAnswer: "طغرل بك",
        incorrectAnswers: ["ألب أرسلان", "ملكشاه", "سنجر"]
    },
    {
        question: "في أي عام وقعت حرب البسوس؟",
        correctAnswer: "494 م",
        incorrectAnswers: ["500 م", "480 م", "510 م"]
    },
    {
        question: "من هو قائد معركة بلاط الشهداء؟",
        correctAnswer: "عبد الرحمن الغافقي",
        incorrectAnswers: ["طارق بن زياد", "موسى بن نصير", "يوسف بن تاشفين"]
    },
    {
        question: "ما هي أقدم مملكة في أوروبا؟",
        correctAnswer: "مملكة ميسينيا",
        incorrectAnswers: ["مملكة إسبرطة", "مملكة أثينا", "مملكة مقدونيا"]
    },
    {
        question: "من هو مؤسس الدولة المرينية؟",
        correctAnswer: "عبد الحق المريني",
        incorrectAnswers: ["أبو يوسف يعقوب", "أبو الحسن المريني", "أبو عنان فارس"]
    },
    {
        question: "في أي عام وقعت معركة واترلو؟",
        correctAnswer: "1815",
        incorrectAnswers: ["1805", "1820", "1830"]
    },
    {
        question: "من هو قائد معركة الزلاقة؟",
        correctAnswer: "يوسف بن تاشفين",
        incorrectAnswers: ["طارق بن زياد", "عبد الرحمن الداخل", "عبد المؤمن بن علي"]
    },
    {
        question: "ما هي أقدم حضارة في الصين؟",
        correctAnswer: "حضارة شانغ",
        incorrectAnswers: ["حضارة تشو", "حضارة هان", "حضارة تانغ"]
    },
    {
        question: "من هو مؤسس الدولة الغزنوية؟",
        correctAnswer: "سبكتكين",
        incorrectAnswers: ["محمود الغزنوي", "مسعود الغزنوي", "إبراهيم الغزنوي"]
    },
    {
        question: "في أي عام وقعت معركة الجمل؟",
        correctAnswer: "656 م",
        incorrectAnswers: ["632 م", "640 م", "661 م"]
    },
    {
        question: "من هو قائد معركة صفين؟",
        correctAnswer: "علي بن أبي طالب",
        incorrectAnswers: ["معاوية بن أبي سفيان", "عمرو بن العاص", "الزبير بن العوام"]
    },
    {
        question: "ما هي أقدم حضارة في الهند؟",
        correctAnswer: "حضارة وادي السند",
        incorrectAnswers: ["حضارة الفيدية", "حضارة الماوريا", "حضارة الغوبتا"]
    },
    {
        question: "من هو مؤسس الدولة البويهية؟",
        correctAnswer: "عماد الدولة البويهي",
        incorrectAnswers: ["عضد الدولة", "ركن الدولة", "معز الدولة"]
    },
    {
        question: "في أي عام وقعت معركة نهاوند؟",
        correctAnswer: "642 م",
        incorrectAnswers: ["632 م", "636 م", "648 م"]
    },
    {
        question: "من هو قائد معركة ملاذكرد؟",
        correctAnswer: "ألب أرسلان",
        incorrectAnswers: ["طغرل بك", "ملكشاه", "سنجر"]
    },
    {
        question: "ما هي أقدم حضارة في اليابان؟",
        correctAnswer: "حضارة جومون",
        incorrectAnswers: ["حضارة يايوي", "حضارة كوفون", "حضارة نارا"]
    },

    // رياضة (20 سؤال)
    {
        question: "كم عدد لاعبي كرة القدم في كل فريق؟",
        correctAnswer: "11",
        incorrectAnswers: ["10", "12", "9"]
    },
    {
        question: "ما هي اللعبة التي تُلعب بمضرب وكرة صغيرة؟",
        correctAnswer: "التنس",
        incorrectAnswers: ["الكرة الطائرة", "كرة السلة", "الهوكي"]
    },
    {
        question: "كم عدد جولات الملاكمة الاحترافية؟",
        correctAnswer: "12",
        incorrectAnswers: ["10", "15", "8"]
    },
    {
        question: "ما هو طول ملعب كرة القدم الدولي؟",
        correctAnswer: "100-110 متر",
        incorrectAnswers: ["90-100 متر", "110-120 متر", "80-90 متر"]
    },
    {
        question: "كم عدد حكام كرة القدم في المباراة؟",
        correctAnswer: "4",
        incorrectAnswers: ["3", "5", "6"]
    },
    {
        question: "ما هي مدة شوط كرة القدم؟",
        correctAnswer: "45 دقيقة",
        incorrectAnswers: ["40 دقيقة", "50 دقيقة", "60 دقيقة"]
    },
    {
        question: "كم عدد لاعبي كرة السلة في كل فريق؟",
        correctAnswer: "5",
        incorrectAnswers: ["6", "4", "7"]
    },
    {
        question: "ما هي مدة شوط كرة السلة؟",
        correctAnswer: "12 دقيقة",
        incorrectAnswers: ["10 دقيقة", "15 دقيقة", "20 دقيقة"]
    },
    {
        question: "كم عدد لاعبي الكرة الطائرة في كل فريق؟",
        correctAnswer: "6",
        incorrectAnswers: ["5", "7", "8"]
    },
    {
        question: "ما هي مدة شوط كرة اليد؟",
        correctAnswer: "30 دقيقة",
        incorrectAnswers: ["25 دقيقة", "35 دقيقة", "40 دقيقة"]
    },
    {
        question: "كم عدد لاعبي الهوكي في كل فريق؟",
        correctAnswer: "11",
        incorrectAnswers: ["10", "12", "9"]
    },
    {
        question: "ما هي مدة شوط الهوكي؟",
        correctAnswer: "35 دقيقة",
        incorrectAnswers: ["30 دقيقة", "40 دقيقة", "45 دقيقة"]
    },
    {
        question: "كم عدد لاعبي الرغبي في كل فريق؟",
        correctAnswer: "15",
        incorrectAnswers: ["13", "14", "16"]
    },
    {
        question: "ما هي مدة شوط الرغبي؟",
        correctAnswer: "40 دقيقة",
        incorrectAnswers: ["35 دقيقة", "45 دقيقة", "50 دقيقة"]
    },
    {
        question: "كم عدد لاعبي البيسبول في كل فريق؟",
        correctAnswer: "9",
        incorrectAnswers: ["8", "10", "11"]
    },
    {
        question: "ما هي مدة شوط البيسبول؟",
        correctAnswer: "9 أشواط",
        incorrectAnswers: ["7 أشواط", "8 أشواط", "10 أشواط"]
    },
    {
        question: "كم عدد لاعبي الكريكيت في كل فريق؟",
        correctAnswer: "11",
        incorrectAnswers: ["10", "12", "9"]
    },
    {
        question: "ما هي مدة شوط الكريكيت؟",
        correctAnswer: "50 over",
        incorrectAnswers: ["40 over", "60 over", "70 over"]
    },
    {
        question: "كم عدد لاعبي الجولف في كل فريق؟",
        correctAnswer: "1",
        incorrectAnswers: ["2", "3", "4"]
    },
    {
        question: "ما هي مدة جولة الجولف؟",
        correctAnswer: "18 حفرة",
        incorrectAnswers: ["9 حفرة", "12 حفرة", "15 حفرة"]
    },

    // فنون (20 سؤال)
    {
        question: "من هو فنان الموناليزا؟",
        correctAnswer: "ليوناردو دافنشي",
        incorrectAnswers: ["مايكل أنجلو", "رافائيل", "بيكاسو"]
    },
    {
        question: "ما هي الآلة الموسيقية التي تعزف بالمفاتيح؟",
        correctAnswer: "البيانو",
        incorrectAnswers: ["الكمان", "الناي", "العود"]
    },
    {
        question: "من هو مؤلف سمفونية القدر؟",
        correctAnswer: "بيتهوفن",
        incorrectAnswers: ["موزارت", "باخ", "شوبان"]
    },
    {
        question: "ما هي أكبر دار أوبرا في العالم؟",
        correctAnswer: "دار أوبرا سيدني",
        incorrectAnswers: ["لا سكالا", "دار أوبرا فيينا", "دار أوبرا باريس"]
    },
    {
        question: "من هو مبتكر شخصية ميكي ماوس؟",
        correctAnswer: "والت ديزني",
        incorrectAnswers: ["وارنر براذرز", "ستيفن سبيلبرغ", "تشارلي تشابلن"]
    },
    {
        question: "من هو فنان لوحة 'ليلة النجوم'؟",
        correctAnswer: "فان جوخ",
        incorrectAnswers: ["بيكاسو", "مونيه", "دالي"]
    },
    {
        question: "ما هي الآلة الموسيقية الوطنية في اسكتلندا؟",
        correctAnswer: "القربة",
        incorrectAnswers: ["الكمان", "الناي", "الطبول"]
    },
    {
        question: "من هو مؤسمفونية 'الربيع'؟",
        correctAnswer: "فيفالدي",
        incorrectAnswers: ["بيتهوفن", "موزارت", "باخ"]
    },
    {
        question: "ما هي أكبر متاحف الفن في العالم؟",
        correctAnswer: "اللوفر",
        incorrectAnswers: ["المتروبوليتان", "الأرميتاج", "التيت"]
    },
    {
        question: "من هو مبتكر شخصية سوبرمان؟",
        correctAnswer: "جيري سيغل",
        incorrectAnswers: ["ستان لي", "بوب كين", "جاك كيربي"]
    },
    {
        question: "من هو فنان لوحة 'الصرخة'؟",
        correctAnswer: "مونش",
        incorrectAnswers: ["فان جوخ", "بيكاسو", "دالي"]
    },
    {
        question: "ما هي الآلة الموسيقية التي تعزف بالقوس؟",
        correctAnswer: "الكمان",
        incorrectAnswers: ["البيانو", "الناي", "العود"]
    },
    {
        question: "من هو مؤلف سمفونية 'غير المنتهية'؟",
        correctAnswer: "شوبرت",
        incorrectAnswers: ["بيتهوفن", "موزارت", "باخ"]
    },
    {
        question: "ما هي أقدم دار أوبرا في العالم؟",
        correctAnswer: "لا سكالا",
        incorrectAnswers: ["دار أوبرا سيدني", "دار أوبرا فيينا", "دار أوبرا باريس"]
    },
    {
        question: "من هو مبتكر شخصية باتمان؟",
        correctAnswer: "بوب كين",
        incorrectAnswers: ["ستان لي", "جيري سيغل", "جاك كيربي"]
    },
    {
        question: "من هو فنان لوحة 'العراة'؟",
        correctAnswer: "بيكاسو",
        incorrectAnswers: ["فان جوخ", "مونيه", "دالي"]
    },
    {
        question: "ما هي الآلة الموسيقية التي تعزف بالنفخ؟",
        correctAnswer: "الناي",
        incorrectAnswers: ["الكمان", "البيانو", "العود"]
    },
    {
        question: "من هو مؤلف سمفونية 'اليوبيل'؟",
        correctAnswer: "هايدن",
        incorrectAnswers: ["بيتهوفن", "موزارت", "باخ"]
    },
    {
        question: "ما هي أشهر دار أوبرا في إيطاليا؟",
        correctAnswer: "لا سكالا",
        incorrectAnswers: ["دار أوبرا سيدني", "دار أوبرا فيينا", "دار أوبرا باريس"]
    },
    {
        question: "من هو مبتكر شخصية سبايدرمان؟",
        correctAnswer: "ستان لي",
        incorrectAnswers: ["بوب كين", "جيري سيغل", "جاك كيربي"]
    },

    // اقتصاد وأعمال (20 سؤال)
    {
        question: "ما هي العملة الرسمية للمملكة المتحدة؟",
        correctAnswer: "الجنيه الإسترليني",
        incorrectAnswers: ["اليورو", "الدولار", "الفرنك"]
    },
    {
        question: "ما هي أكبر شركة تقنية في العالم؟",
        correctAnswer: "أبل",
        incorrectAnswers: ["مايكروسوفت", "غوغل", "أمازون"]
    },
    {
        question: "ما هو المقر الرئيسي للأمم المتحدة؟",
        correctAnswer: "نيويورك",
        incorrectAnswers: ["جنيف", "باريس", "لندن"]
    },
    {
        question: "ما هي عملة اليابان؟",
        correctAnswer: "الين",
        incorrectAnswers: ["اليوان", "الوون", "الروبية"]
    },
    {
        question: "ما هي أكبر بورصة في العالم؟",
        correctAnswer: "بورصة نيويورك",
        incorrectAnswers: ["بورصة لندن", "بورصة طوكيو", "بورصة هونغ كونغ"]
    },
    {
        question: "ما هي العملة الرسمية للاتحاد الأوروبي؟",
        correctAnswer: "اليورو",
        incorrectAnswers: ["الدولار", "الجنيه", "الفرنك"]
    },
    {
        question: "ما هي أكبر شركة سيارات في العالم؟",
        correctAnswer: "تويوتا",
        incorrectAnswers: ["فولكس فاجن", "جنرال موتورز", "فورد"]
    },
    {
        question: "ما هو المقر الرئيسي لصندوق النقد الدولي؟",
        correctAnswer: "واشنطن",
        incorrectAnswers: ["نيويورك", "لندن", "جنيف"]
    },
    {
        question: "ما هي عملة الصين؟",
        correctAnswer: "اليوان",
        incorrectAnswers: ["الين", "الوون", "الروبية"]
    },
    {
        question: "ما هي أكبر بورصة في أوروبا؟",
        correctAnswer: "بورصة لندن",
        incorrectAnswers: ["بورصة فرانكفورت", "بورصة باريس", "بورصة ميلانو"]
    },
    {
        question: "ما هي العملة الرسمية لسويسرا؟",
        correctAnswer: "الفرنك السويسري",
        incorrectAnswers: ["اليورو", "الدولار", "الجنيه"]
    },
    {
        question: "ما هي أكبر شركة طيران في العالم؟",
        correctAnswer: "دلتا إيرلاينز",
        incorrectAnswers: ["إميريتس", "لوفتهانزا", "أمريكان إيرلاينز"]
    },
    {
        question: "ما هو المقر الرئيسي للبنك الدولي؟",
        correctAnswer: "واشنطن",
        incorrectAnswers: ["نيويورك", "لندن", "جنيف"]
    },
    {
        question: "ما هي عملة الهند؟",
        correctAnswer: "الروبية",
        incorrectAnswers: ["اليوان", "الين", "الوون"]
    },
    {
        question: "ما هي أكبر بورصة في آسيا؟",
        correctAnswer: "بورصة طوكيو",
        incorrectAnswers: ["بورصة شنغهاي", "بورصة هونغ كونغ", "بورصة سيول"]
    },
    {
        question: "ما هي العملة الرسمية لكندا؟",
        correctAnswer: "الدولار الكندي",
        incorrectAnswers: ["اليورو", "الدولار الأمريكي", "الجنيه"]
    },
    {
        question: "ما هي أكبر شركة نفط في العالم؟",
        correctAnswer: "أرامكو",
        incorrectAnswers: ["إكسون موبيل", "شل", "بي بي"]
    },
    {
        question: "ما هو المقر الرئيسي لمنظمة التجارة العالمية؟",
        correctAnswer: "جنيف",
        incorrectAnswers: ["نيويورك", "واشنطن", "لندن"]
    },
    {
        question: "ما هي عملة روسيا؟",
        correctAnswer: "الروبل",
        incorrectAnswers: ["اليورو", "الدولار", "الجنيه"]
    },
    {
        question: "ما هي أكبر بورصة في الشرق الأوسط؟",
        correctAnswer: "بورصة السعودية",
        incorrectAnswers: ["بورصة دبي", "بورصة قطر", "بورصة الكويت"]
    },

    // تكنولوجيا (20 سؤال)
    {
        question: "من هو مؤسس شركة مايكروسوفت؟",
        correctAnswer: "بيل غيتس",
        incorrectAnswers: ["ستيف جوبز", "مارك زوكربيرغ", "لاري بيج"]
    },
    {
        question: "ما هو نظام التشغيل الأكثر استخداماً في العالم؟",
        correctAnswer: "ويندوز",
        incorrectAnswers: ["ماك", "لينكس", "أندرويد"]
    },
    {
        question: "ما هي لغة البرمجة المستخدمة في تطبيقات الأندرويد؟",
        correctAnswer: "جافا",
        incorrectAnswers: ["بايثون", "سي بلس بلس", "سويفت"]
    },
    {
        question: "من هو مخترع الهاتف؟",
        correctAnswer: "غراهام بيل",
        incorrectAnswers: ["توماس إديسون", "نيكولا تيسلا", "ألكسندر فلمنج"]
    },
    {
        question: "ما هي أول شبكة اجتماعية على الإنترنت؟",
        correctAnswer: "فيس بوك",
        incorrectAnswers: ["تويتر", "ماي سبيس", "لينكد إن"]
    },
    {
        question: "من هو مؤسس شركة آبل؟",
        correctAnswer: "ستيف جوبز",
        incorrectAnswers: ["بيل غيتس", "مارك زوكربيرغ", "لاري بيج"]
    },
    {
        question: "ما هو نظام التشغيل المستخدم في هواتف آيفون؟",
        correctAnswer: "آي أو إس",
        incorrectAnswers: ["أندرويد", "ويندوز", "لينكس"]
    },
    {
        question: "ما هي لغة البرمجة المستخدمة في تطبيقات آيفون؟",
        correctAnswer: "سويفت",
        incorrectAnswers: ["جافا", "بايثون", "سي بلس بلس"]
    },
    {
        question: "من هو مخترع الإنترنت؟",
        correctAnswer: "تيم بيرنرز لي",
        incorrectAnswers: ["بيل غيتس", "ستيف جوبز", "مارك زوكربيرغ"]
    },
    {
        question: "ما هي أول محرك بحث على الإنترنت؟",
        correctAnswer: "ألتا فيستا",
        incorrectAnswers: ["غوغل", "ياهو", "بينغ"]
    },
    {
        question: "من هو مؤسس شركة غوغل؟",
        correctAnswer: "لاري بيج",
        incorrectAnswers: ["بيل غيتس", "ستيف جوبز", "مارك زوكربيرغ"]
    },
    {
        question: "ما هو نظام التشغيل مفتوح المصدر؟",
        correctAnswer: "لينكس",
        incorrectAnswers: ["ويندوز", "ماك", "آي أو إس"]
    },
    {
        question: "ما هي لغة البرمجة المستخدمة في الذكاء الاصطناعي؟",
        correctAnswer: "بايثون",
        incorrectAnswers: ["جافا", "سي بلس بلس", "سويفت"]
    },
    {
        question: "من هو مخترع الكمبيوتر؟",
        correctAnswer: "تشارلز بابيج",
        incorrectAnswers: ["بيل غيتس", "ستيف جوبز", "آلان تورينج"]
    },
    {
        question: "ما هي أول شركة هواتف ذكية؟",
        correctAnswer: "آي بي إم",
        incorrectAnswers: ["آبل", "سامسونج", "نوكيا"]
    },
    {
        question: "من هو مؤسس شركة أمازون؟",
        correctAnswer: "جيف بيزوس",
        incorrectAnswers: ["بيل غيتس", "ستيف جوبز", "مارك زوكربيرغ"]
    },
    {
        question: "ما هو نظام التشغيل المستخدم في ساعات آبل؟",
        correctAnswer: "ووتش أو إس",
        incorrectAnswers: ["آي أو إس", "أندرويد", "ويندوز"]
    },
    {
        question: "ما هي لغة البرمجة المستخدمة في تطوير الويب؟",
        correctAnswer: "جافا سكريبت",
        incorrectAnswers: ["بايثون", "جافا", "سي بلس بلس"]
    },
    {
        question: "من هو مخترع البريد الإلكتروني؟",
        correctAnswer: "راي توملينسون",
        incorrectAnswers: ["بيل غيتس", "ستيف جوبز", "مارك زوكربيرغ"]
    },
    {
        question: "ما هي أول لعبة فيديو تجارية؟",
        correctAnswer: "بونغ",
        incorrectAnswers: ["سوبر ماريو", "باك مان", "تيتريس"]
    },

    // دين (20 سؤال)
    {
        question: "كم عدد أركان الإسلام؟",
        correctAnswer: "5",
        incorrectAnswers: ["4", "6", "7"]
    },
    {
        question: "ما هي أول سورة في القرآن الكريم؟",
        correctAnswer: "الفاتحة",
        incorrectAnswers: ["البقرة", "العلق", "الناس"]
    },
    {
        question: "كم عدد سور القرآن الكريم؟",
        correctAnswer: "114",
        incorrectAnswers: ["110", "120", "100"]
    },
    {
        question: "ما هي أطول سورة في القرآن؟",
        correctAnswer: "البقرة",
        incorrectAnswers: ["النساء", "آل عمران", "المائدة"]
    },
    {
        question: "ما هي السورة التي تسمى قلب القرآن؟",
        correctAnswer: "يس",
        incorrectAnswers: ["الرحمن", "الواقعة", "الملك"]
    },
    {
        question: "كم عدد أركان الإيمان؟",
        correctAnswer: "6",
        incorrectAnswers: ["5", "7", "8"]
    },
    {
        question: "ما هي أقصر سورة في القرآن؟",
        correctAnswer: "الكوثر",
        incorrectAnswers: ["الناس", "الفيل", "العصر"]
    },
    {
        question: "كم عدد أجزاء القرآن الكريم؟",
        correctAnswer: "30",
        incorrectAnswers: ["28", "32", "25"]
    },
    {
        question: "ما هي السورة التي تسمى عروس القرآن؟",
        correctAnswer: "الرحمن",
        incorrectAnswers: ["يس", "الواقعة", "الملك"]
    },
    {
        question: "كم عدد الأنبياء المذكورين في القرآن؟",
        correctAnswer: "25",
        incorrectAnswers: ["20", "30", "35"]
    },
    {
        question: "ما هي السورة التي تسمى سورة التوديع؟",
        correctAnswer: "النصر",
        incorrectAnswers: ["الفتح", "الحديد", "الحشر"]
    },
    {
        question: "كم عدد آيات القرآن الكريم؟",
        correctAnswer: "6236",
        incorrectAnswers: ["6000", "6200", "6300"]
    },
    {
        question: "ما هي السورة التي تسمى سنام القرآن؟",
        correctAnswer: "البقرة",
        incorrectAnswers: ["النساء", "آل عمران", "المائدة"]
    },
    {
        question: "كم عدد السجدات في القرآن؟",
        correctAnswer: "15",
        incorrectAnswers: ["12", "14", "16"]
    },
    {
        question: "ما هي السورة التي تسمى سورة النبي؟",
        correctAnswer: "ال عمران",
        incorrectAnswers: ["البقرة", "النساء", "المائدة"]
    },
    {
        question: "كم عدد أحزاب القرآن؟",
        correctAnswer: "60",
        incorrectAnswers: ["50", "55", "65"]
    },
    {
        question: "ما هي السورة التي تسمى سورة الحواريين؟",
        correctAnswer: "الصف",
        incorrectAnswers: ["الحديد", "الحشر", "الممتحنة"]
    },
    {
        question: "كم عدد كلمات القرآن الكريم؟",
        correctAnswer: "77439",
        incorrectAnswers: ["70000", "75000", "80000"]
    },
    {
        question: "ما هي السورة التي تسمى سورة النساء الصغرى؟",
        correctAnswer: "الطلاق",
        incorrectAnswers: ["النساء", "الممتحنة", "المجادلة"]
    },
    {
        question: "كم عدد حروف القرآن الكريم؟",
        correctAnswer: "323671",
        incorrectAnswers: ["300000", "320000", "330000"]
    },

    // طب (20 سؤال)
    {
        question: "ما هو العضو المسؤول عن ضخ الدم في الجسم؟",
        correctAnswer: "القلب",
        incorrectAnswers: ["الرئتين", "الكبد", "الدماغ"]
    },
    {
        question: "ما هو عدد ضربات القلب الطبيعية في الدقيقة؟",
        correctAnswer: "60-100",
        incorrectAnswers: ["40-60", "100-120", "120-140"]
    },
    {
        question: "ما هو العضو الأكبر في جسم الإنسان؟",
        correctAnswer: "الجلد",
        incorrectAnswers: ["الكبد", "القلب", "الدماغ"]
    },
    {
        question: "ما هو عدد أسنان الإنسان البالغ؟",
        correctAnswer: "32",
        incorrectAnswers: ["28", "30", "34"]
    },
    {
        question: "ما هو المرض الذي يسببه فيروس نقص المناعة؟",
        correctAnswer: "الإيدز",
        incorrectAnswers: ["السرطان", "السكري", "السل"]
    },
    {
        question: "ما هو العضو المسؤول عن تنقية الدم؟",
        correctAnswer: "الكبد",
        incorrectAnswers: ["القلب", "الرئتين", "الدماغ"]
    },
    {
        question: "ما هو عدد عظام جمجمة الإنسان؟",
        correctAnswer: "22",
        incorrectAnswers: ["20", "24", "26"]
    },
    {
        question: "ما هو العضو المسؤول عن إنتاج الأنسولين؟",
        correctAnswer: "البنكرياس",
        incorrectAnswers: ["الكبد", "القلب", "الدماغ"]
    },
    {
        question: "ما هو عدد ضلوع القفص الصدري؟",
        correctAnswer: "24",
        incorrectAnswers: ["20", "22", "26"]
    },
    {
        question: "ما هو المرض الذي يسببه فيروس الإنفلونزا؟",
        correctAnswer: "الإنفلونزا",
        incorrectAnswers: ["السل", "الكوليرا", "التيفوئيد"]
    },
    {
        question: "ما هو العضو المسؤول عن حاسة الشم؟",
        correctAnswer: "الأنف",
        incorrectAnswers: ["العين", "الأذن", "اللسان"]
    },
    {
        question: "ما هو عدد فقرات العمود الفقري؟",
        correctAnswer: "33",
        incorrectAnswers: ["30", "32", "34"]
    },
    {
        question: "ما هو العضو المسؤول عن حاسة التذوق؟",
        correctAnswer: "اللسان",
        incorrectAnswers: ["الأنف", "العين", "الأذن"]
    },
    {
        question: "ما هو عدد عضلات جسم الإنسان؟",
        correctAnswer: "600",
        incorrectAnswers: ["500", "550", "650"]
    },
    {
        question: "ما هو المرض الذي يسببه فيروس الكورونا؟",
        correctAnswer: "كوفيد-19",
        incorrectAnswers: ["الإيدز", "الإنفلونزا", "السل"]
    },
    {
        question: "ما هو العضو المسؤول عن حاسة البصر؟",
        correctAnswer: "العين",
        incorrectAnswers: ["الأنف", "الأذن", "اللسان"]
    },
    {
        question: "ما هو عدد صمامات القلب؟",
        correctAnswer: "4",
        incorrectAnswers: ["3", "5", "6"]
    },
    {
        question: "ما هو العضو المسؤول عن حاسة السمع؟",
        correctAnswer: "الأذن",
        incorrectAnswers: ["العين", "الأنف", "اللسان"]
    },
    {
        question: "ما هو عدد فصي الرئة؟",
        correctAnswer: "5",
        incorrectAnswers: ["4", "6", "7"]
    },
    {
        question: "ما هو المرض الذي يسببه فيروس الحصبة؟",
        correctAnswer: "الحصبة",
        incorrectAnswers: ["الجدري", "الحمى", "الإنفلونزا"]
    }
];

let handler = async (m, { conn, usedPrefix }) => {
    try {
        const chatId = m.chat;
        
        // التحقق إذا كانت اللعبة نشطة
        if (global.games.thaqafa && global.games.thaqafa[chatId]) {
            await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n⚠️ *يوجد سؤال نشط هنا!*`, m);
            return;
        }

        // اختيار سؤال عشوائي
        const randomIndex = Math.floor(Math.random() * ARABIC_TRIVIA_QUESTIONS.length);
        const questionData = ARABIC_TRIVIA_QUESTIONS[randomIndex];

        const correctAnswer = questionData.correctAnswer;
        const allOptions = [...questionData.incorrectAnswers, correctAnswer].sort(() => Math.random() - 0.5);

        // حفظ حالة اللعبة
        global.games.thaqafa = global.games.thaqafa || {};
        
        global.games.thaqafa[chatId] = {
            question: questionData.question,
            correctAnswer: correctAnswer.toLowerCase(),
            correctAnswerText: correctAnswer,
            options: allOptions,
            startTime: Date.now(),
            timeout: setTimeout(async () => {
                if (global.games.thaqafa && global.games.thaqafa[chatId]) {
                    await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n⏰ *انتهى الوقت!*\n✅ *الإجابة:* ${correctAnswer}`, m);
                    delete global.games.thaqafa[chatId];
                }
            }, timeout),
            attempts: 0,
            hintsGiven: []
        };

        const game = global.games.thaqafa[chatId];
        const optionsText = game.options.map((opt, index) => `${index + 1}. ${opt}`).join('\n');
        
        // حفظ رقم الإجابة الصحيحة
        const correctIndex = game.options.findIndex(opt => opt === game.correctAnswerText) + 1;
        global.games.thaqafa[chatId].correctIndex = correctIndex;

        let caption = `
*📜 تنغن كيرا 🍁*

🎮 *لعبة:* الثقافة العامة
❓ *السؤال:* ${game.question}

${optionsText}

⏰ *الوقت:* ${(timeout / 1000)} ثانية
🎯 *الجائزة:* ${poin} نقطة

🚪 *انسحب:* اكتب "انسحب"
💡 *المطلوب:* اكتب رقم الإجابة

🍁 *الشعار:* اختبر معرفتك
`.trim();

        // إرسال السؤال
        await conn.reply(m.chat, caption, m);

    } catch (error) {
        console.error('❌ خطأ في لعبة ثقافة:', error);
        await conn.reply(m.chat, '❌ حدث خطأ في تشغيل اللعبة! حاول مرة أخرى.', m);
    }
}

// معالج الإجابات
handler.before = async (m, { conn }) => {
    try {
        if (m.isBaileys || !m.text) return false;
        
        const chatId = m.chat;
        const userId = m.sender;
        const game = global.games.thaqafa ? global.games.thaqafa[chatId] : null;
        
        if (!game) return false;

        let userAnswer = m.text.trim();

        // التحقق من الانسحاب
        if (userAnswer === 'انسحب') {
            clearTimeout(game.timeout);
            
            try { await m.react('🚪'); } catch (e) {}
            
            await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n🚪 *تم الانسحاب!*\n✅ *الإجابة:* ${game.correctAnswerText}`, m);
            delete global.games.thaqafa[chatId];
            return true;
        }

        // تحويل الأرقام العربية والفارسية إلى إنجليزية
        const numberMap = {
            '١': '1', '٢': '2', '٣': '3', '٤': '4',
            '۱': '1', '۲': '2', '۳': '3', '۴': '4',
        };
        
        if (userAnswer.length === 1 && numberMap[userAnswer]) {
            userAnswer = numberMap[userAnswer];
        }

        let isCorrect = false;

        // تحقق من الرقم أولاً
        const answerNum = parseInt(userAnswer);
        if (!isNaN(answerNum) && answerNum >= 1 && answerNum <= 4) {
            if (answerNum === game.correctIndex) {
                isCorrect = true;
            }
        }
        // ثم تحقق من النص
        else if (userAnswer.toLowerCase() === game.correctAnswer) {
            isCorrect = true;
        }

        // التحقق من الإجابة الصحيحة
        if (isCorrect) {
            clearTimeout(game.timeout);
            
            const timeTaken = Math.floor((Date.now() - game.startTime) / 1000);
            
            try { await m.react('✅'); } catch (e) {}
            
            let winText = `*📜 تنغن كيرا 🍁*\n\n🎉 *إجابة صحيحة!*\n🏆 *الفائز:* ${m.pushName || 'مستخدم'}\n✅ *الإجابة:* ${game.correctAnswerText}\n💰 *الجائزة:* ${poin} نقطة\n⏱️ *الوقت:* ${timeTaken} ثانية`;
            
            await conn.reply(m.chat, winText, m);
            delete global.games.thaqafa[chatId];
            return true;
        }

        // إجابة خاطئة
        game.attempts++;
        
        let hintMessage = `❌ *إجابة خاطئة!*\n💡 حاول مرة أخرى`;
        
        let extraHint = '';
        if (game.attempts >= 2 && !game.hintsGiven.includes('options')) {
            extraHint = `\n💡 *اختر من:* 1, 2, 3, 4`;
            game.hintsGiven.push('options');
        } else if (game.attempts >= 4 && !game.hintsGiven.includes('firstLetter')) {
            const firstLetter = game.correctAnswerText.charAt(0);
            extraHint = `\n💡 *الحرف الأول:* ${firstLetter}`;
            game.hintsGiven.push('firstLetter');
        }

        try { await m.react('❌'); } catch (e) {}

        await conn.reply(m.chat, `*📜 تنغن كيرا 🍁*\n\n${hintMessage}${extraHint}\n📊 *المحاولة:* ${game.attempts}`, m);

        return true;

    } catch (error) {
        console.error('❌ خطأ في معالجة الإجابة:', error);
        return false;
    }
}

handler.help = ['ثقافة']
handler.tags = ['game']
handler.command = /^(ثقافة|thaqafa|اسئلة)$/i
handler.group = true

export default handler;