// @ts-nocheck
import chromium from"chrome-aws-lambda";import playwright from"playwright-core";export default async function handler(e,a){const t=e.query.url;if(!t||"string"!=typeof t)return a.status(400).send("url is required");const r=await chromium.executablePath,i=await playwright.chromium.launch({args:chromium.args,executablePath:r,headless:chromium.headless}),o=await i.newPage({viewport:{width:1200,height:630}});await o.goto(t,{timeout:15e3});const s=await o.screenshot({type:"png"});await i.close(),a.setHeader("Cache-Control","s-maxage=31536000, stale-while-revalidate"),a.setHeader("Content-Type","image/png"),a.end(s)}