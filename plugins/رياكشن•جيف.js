import fs from 'fs'
import path from 'path'
import uploadImage from '../lib/uploadImage.js'
import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let who
    
    // 1. تحديد المستخدم المقصود (منشن، اقتباس، أو المُرسِل نفسه)
    if (m.isGroup) {
        who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.sender
    } else {
        who = m.chat
    }
    
    let name = conn.getName(m.sender) // اسم المُرسِل
    let name2 = conn.getName(who) // اسم الشخص المقصود
    let str
    let videos = []
    let emoji = ''

    // 2. معالجة الأوامر المختلفة
    if (/^(angry|enojado|غاضب)$/i.test(command)) {
        emoji = '😡'
        str = m.mentionedJid.length > 0 || m.quoted ? `\`${name}\` غاضب/ة من \`${name2}\`.` : `\`${name}\` غاضب/ة. 😠`
        videos = [
            'https://files.catbox.moe/2aedd3.mp4',
            'https://files.catbox.moe/fqf4ey.mp4',
            'https://files.catbox.moe/v7ldgq.mp4',
            'https://files.catbox.moe/uedd7l.mp4',
            'https://files.catbox.moe/5stubg.mp4',
            'https://files.catbox.moe/phaft3.mp4'
        ]
    } else if (/^(blush|sonrojarse|خجل)$/i.test(command)) {
        emoji = '🫣'
        str = m.mentionedJid.length > 0 || m.quoted ? `\`${name}\` خجل/ة بسبب \`${name2}\`.` : `\`${name}\` يشعر/تشعر بالخجل. 😳`
        videos = [
            'https://telegra.ph/file/a4f925aac453cad828ef2.mp4',
            'https://telegra.ph/file/f19318f1e8dad54303055.mp4',
            'https://telegra.ph/file/15605caa86eee4f924c87.mp4',
            'https://telegra.ph/file/d301ffcc158502e39afa7.mp4',
            'https://telegra.ph/file/c6105160ddd3ca84f887a.mp4',
            'https://telegra.ph/file/abd44f64e45c3f30442bd.mp4',
            'https://telegra.ph/file/9611e5c1d616209bc0315.mp4'
        ]
    } else if (/^(cuddle|acurrucarse|احتضان)$/i.test(command)) {
        emoji = '👥'
        str = m.mentionedJid.length > 0 || m.quoted ? `\`${name}\` احتضن/ت \`${name2}\` بدفء.` : `\`${name}\` يحتضن/تحتضن نفسه/ا. 🫂`
        videos = [
            'https://qu.ax/snjY.mp4',
            'https://qu.ax/MpVBh.mp4',
            'https://qu.ax/fLTgG.mp4',
            'https://qu.ax/jDioL.mp4',
            'https://qu.ax/cEGWw.mp4',
            'https://qu.ax/PRgKB.mp4',
            'https://qu.ax/cUfzD.mp4',
            'https://qu.ax/xgsXY.mp4'
        ]
    } else if (/^(dance|bailar|رقص)$/i.test(command)) {
        emoji = '💃'
        str = m.mentionedJid.length > 0 || m.quoted ? `\`${name}\` يرقص/ترقص مع \`${name2}\` (ﾉ^ヮ^)ﾉ*:・ﾟ✧` : `\`${name}\` يرقص/ترقص بحرية! 🎶`
        videos = [
            'https://tinyurl.com/26djysdo',
            'https://tinyurl.com/294oahv9'
        ]
    } else if (/^(drunk|borracho|سكران)$/i.test(command)) {
        emoji = '🍺'
        str = m.mentionedJid.length > 0 || m.quoted ? `\`${name}\` يشرب/تشرب مع \`${name2}\` حتى الثمالة.` : `\`${name}\` في حالة سُكر شديدة. 😵‍💫`
        videos = [
            'https://qu.ax/VPXAF.mp4',
            'https://qu.ax/JJwdG.mp4',
            'https://qu.ax/BHgcX.mp4',
            'https://qu.ax/SmJNk.mp4',
            'https://qu.ax/bLUOB.mp4',
            'https://qu.ax/mDURZ.mp4',
            'https://qu.ax/KTFrC.mp4',
            'https://qu.ax/blVqp.mp4'
        ]
    } else if (/^(hello|hola|مرحباً)$/i.test(command)) {
        emoji = '👋'
        str = m.mentionedJid.length > 0 || m.quoted ? `\`${name}\` يرحب/ترحب بـ \`${name2}\`.` : `\`${name}\` يحيي/تحيي الجميع! 👋`
        videos = [
            'https://qu.ax/EcRBE.mp4',
            'https://qu.ax/oARle.mp4',
            'https://qu.ax/eQXQh.mp4',
            'https://qu.ax/ddLrC.mp4',
            'https://qu.ax/oalOG.mp4',
            'https://qu.ax/nYJ.mp4',
            'https://qu.ax/bkcz.mp4'
        ]
    } else if (/^(kiss|besar|تقبيل)$/i.test(command)) {
        emoji = '🫦'
        str = m.mentionedJid.length > 0 || m.quoted ? `\`${name}\` قَبّل/ت \`${name2}\`.` : `\`${name}\` يقبّل/تقبّل نفسه/ا ( ˘ ³˘)♥`
        videos = [
            'https://telegra.ph/file/d6ece99b5011aedd359e8.mp4',
            'https://telegra.ph/file/ba841c699e9e039deadb3.mp4',
            'https://telegra.ph/file/6497758a122357bc5bbb7.mp4',
            'https://telegra.ph/file/8c0f70ed2bfd95a125993.mp4',
            'https://telegra.ph/file/826ce3530ab20b15a496d.mp4'
        ]
    } else if (/^(kiss2|besar2|تقبيل2)$/i.test(command)) {
        emoji = '🏳️‍🌈'
        str = m.mentionedJid.length > 0 || m.quoted ? `\`${name}\` قَبّل/ت \`${name2}\` بشغف. 💋` : `\`${name}\` يقبّل/تقبّل نفسه/ا بشغف.`
        videos = [
            'https://qu.ax/bLLe.mp4',
            'https://qu.ax/mwXW.mp4',
            'https://qu.ax/WUiG.mp4',
            'https://qu.ax/djk.mp4',
            'https://qu.ax/xdis.mp4'
        ]
    } else if (/^(love2|enamorada|enamorado|عشق)$/i.test(command)) {
        emoji = '😍'
        str = m.mentionedJid.length > 0 || m.quoted ? `\`${name}\` مُغرم/ة بـ \`${name2}\`. ❤️` : `\`${name}\` مُغرم/ة. ✨`
        videos = [
            'https://telegra.ph/file/5fbd60c40ab190ecc8e1c.mp4',
            'https://telegra.ph/file/ca30d358d292674698b40.mp4',
            'https://telegra.ph/file/25f88386dd7d4d6df36fa.mp4',
            'https://telegra.ph/file/eb63131df0de6b47c7ab7.mp4',
            'https://telegra.ph/file/209990ee46c645506a5fc.mp4',
            'https://telegra.ph/file/440f276fcbb2d04cbf1d1.mp4',
            'https://telegra.ph/file/42cea67d9b013ed9a9cd0.mp4'
        ]
    } else return

    // 3. إرسال الرد
    await m.react(emoji)
    if (m.isGroup) {
        let video = videos[Math.floor(Math.random() * videos.length)]
        let mentions = [who]
        conn.sendMessage(m.chat, { video: { url: video }, gifPlayback: true, caption: str, mentions }, { quoted: m })
    }
}

handler.help = ['غاضب','خجل','احتضان','رقص','سكران','مرحباً','تقبيل','تقبيل2','عشق']
handler.tags = ['ترفيه']
handler.command = ['غاضب','خجل','احتضان','رقص','سكران','مرحباً','تقبيل','تقبيل2','عشق']
handler.group = true

export default handler