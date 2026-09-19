// Separate vector buildings let the scenery resize without stretching the houses.
export function houseArt(index) {
 const red=[0,2,4].includes(index),cap=red?'#df5947':'#398fbd',shade=red?'#b94236':'#2677a5';
 const flip=[0,3].includes(index);
 return `<svg class="house-art" viewBox="0 0 260 260" aria-hidden="true"><g stroke="#526451" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
 <ellipse cx="131" cy="241" rx="105" ry="13" fill="#648d5e" opacity=".18" stroke="none"/>
 <g transform="${flip?'translate(260 0) scale(-1 1)':''}">
 <path d="M193 95 190 34 216 34 220 103" fill="#b8bbb0"/><path d="M186 30 219 30 219 42 187 42Z" fill="#d8d8c5"/><path d="M191 57h26m-25 17h25m-13-31v14m-7 1v15" fill="none" stroke="#8a9586" stroke-width="2"/>
 <path d="M49 130Q35 178 43 226Q117 248 215 226Q220 177 200 130Z" fill="#f5e6bf"/>
 <path d="M49 135Q112 113 199 137L211 164Q122 144 44 169Z" fill="#decca1" stroke="none"/>
 <path d="M19 130C14 104 53 88 76 52C91 27 110 16 137 21C168 23 180 53 196 72C218 97 247 111 243 135C239 155 211 151 185 143C147 131 119 130 83 140C54 147 24 154 19 130Z" fill="${cap}"/>
 <path d="M22 123C27 143 54 138 84 129C135 113 179 127 204 136Q229 145 242 128Q249 155 208 148Q132 124 83 141Q22 162 19 130Z" fill="${shade}" stroke="none"/>
 <path d="M22 132Q20 156 83 140Q133 123 185 143Q241 163 243 135" fill="none"/>
 <ellipse cx="82" cy="87" rx="20" ry="17" transform="rotate(-30 82 87)" fill="#fff0cc" stroke="none"/><ellipse cx="164" cy="70" rx="17" ry="21" transform="rotate(-30 164 70)" fill="#fff0cc" stroke="none"/><ellipse cx="215" cy="113" rx="11" ry="9" fill="#fff0cc" stroke="none"/>
 <path d="M107 231v-46C107 146 154 147 154 185v49Z" fill="#b78a4d"/><path d="M116 171v59m13-67v69m14-61v61" stroke="#936e3e" stroke-width="1.7"/><ellipse cx="118" cy="205" rx="3" ry="4" fill="#e4bd6b"/>
 <path d="M101 231 158 232 165 241 95 239Z" fill="#c3bc9c"/>
 <rect x="57" y="172" width="27" height="29" rx="4" fill="#619cb0"/><path d="M70 173v27m-12-14h25" stroke="#f3dfab"/><path d="M47 172h9v30h-9Zm39 0h9v30h-9Z" fill="#b88a4f"/>
 <path d="M48 210q25-10 45 0" fill="none" stroke="#689159" stroke-width="8"/><g fill="#fff2d6" stroke="none"><circle cx="58" cy="207" r="4"/><circle cx="73" cy="211" r="4"/><circle cx="85" cy="206" r="4"/></g>
 <path d="M177 223q-9-19 0-26q11 14 0 26m0 0q9-25 19-20q-2 18-19 20" fill="#739e61" stroke="none"/>
 <path d="M203 232v-32m23 32v-28m-23 5 23 4" stroke="#a17d47" stroke-width="6"/>
 </g></g></svg>`;
}

export function villageBackground(){return `<svg class="village-scenery desktop-scenery" viewBox="0 0 1400 900" preserveAspectRatio="none" aria-hidden="true">
 <defs><linearGradient id="meadow" x2="0" y2="1"><stop stop-color="#bad397"/><stop offset="1" stop-color="#cbdba3"/></linearGradient><g id="bush"><path d="M-48 16C-69-6-42-29-25-22C-30-49 10-53 21-29C47-47 67-13 44 5Q61 33 21 31Q-18 47-48 16Z" fill="#78a16a"/><path d="M-42 15Q-10 31 36 9Q52 31 12 34Q-25 43-42 15" fill="#608d61"/></g><g id="tree"><path d="M-15 175Q7 107-6 30L20 25Q10 111 35 180L15 175 7 183-1 171Z" fill="#ac8654" stroke="#5e704f" stroke-width="3"/><path d="M4 105Q-22 62-43 32m52 93Q33 66 53 34" stroke="#ac8654" stroke-width="17"/><path d="M-93 37C-126 14-112-30-79-36C-80-67-36-78-14-64C2-102 61-89 69-58C108-64 131-26 105-4C128 32 90 60 67 49C37 76 1 61-8 57C-43 76-80 65-93 37Z" fill="#719a60" stroke="#5e8156" stroke-width="3"/><path d="M-98 20Q-39 57 2 37Q67 58 110 5Q121 44 67 49Q33 73-8 57Q-65 82-98 20" fill="#608a55"/></g></defs>
 <path fill="url(#meadow)" d="M0 0h1400v900H0Z"/>
 <path d="M140 0 175 74 241 40 308 96 405 35 478 85 554 0M900 0l86 69 82-50 65 90 125-67 40-42" fill="#a8b7a1" opacity=".6"/>
 <path d="M-70 696C100 688 81 802 240 814S368 951 574 935M1504 427Q1303 450 1350 575Q1378 624 1480 661" fill="none" stroke="#89a882" stroke-width="69"/><path d="M-70 696C100 688 81 802 240 814S368 951 574 935M1504 427Q1303 450 1350 575Q1378 624 1480 661" fill="none" stroke="#75b7c6" stroke-width="52"/><path d="M-20 698Q58 696 82 749M244 814Q312 827 340 870M1389 465Q1342 485 1357 522" fill="none" stroke="#c8e6d9" stroke-width="4"/>
 <path d="M203 766Q291 692 374 629M106 821Q69 867 44 920" fill="none" stroke="#e8d6a5" stroke-width="39"/><path d="M93 788Q137 742 204 761L227 801Q161 783 116 830Z" fill="#c79f65" stroke="#826d47" stroke-width="3"/><path d="m117 776 23 38m2-50 22 41m5-46 22 41" stroke="#a58051" stroke-width="3"/>
 <use href="#tree" transform="translate(64 50) scale(1.25)"/><use href="#tree" transform="translate(1360 44) scale(1.3)"/><use href="#tree" transform="translate(35 422) scale(.85)"/>
 <use href="#bush" transform="translate(54 636)"/><use href="#bush" transform="translate(1260 122) scale(.6)"/><use href="#bush" transform="translate(1383 703) scale(1.3)"/><use href="#bush" transform="translate(1007 888) scale(1.5)"/><use href="#bush" transform="translate(435 880)"/><use href="#bush" transform="translate(549 70) scale(.8)"/>
 <g fill="#fff0c5"><circle cx="125" cy="583" r="5"/><circle cx="121" cy="667" r="5"/><circle cx="1057" cy="761" r="5"/><circle cx="1019" cy="749" r="4"/><circle cx="407" cy="142" r="4"/><circle cx="1150" cy="397" r="5"/></g></svg><svg class="village-scenery mobile-scenery" viewBox="0 0 500 900" preserveAspectRatio="none" aria-hidden="true">
 <path fill="#c4d8a1" d="M0 0h500v900H0Z"/>
 <path d="M-30 698Q93 724 42 821Q23 866 157 924M542 487Q454 479 490 563Q516 609 557 610" fill="none" stroke="#8baa7d" stroke-width="48"/><path d="M-30 698Q93 724 42 821Q23 866 157 924M542 487Q454 479 490 563Q516 609 557 610" fill="none" stroke="#75b7c6" stroke-width="35"/>
 <path d="M80 796Q112 735 155 665M14 806Q-4 837-25 852" fill="none" stroke="#e8d6a5" stroke-width="27"/><path d="M12 791Q44 767 82 784L80 811Q44 795 16 818Z" fill="#c79f65" stroke="#826d47" stroke-width="2"/><path d="m32 782 1 26m20-29v25m18-23v25" stroke="#a58051" stroke-width="2"/>
 <svg x="-55" y="-30" width="160" height="245" viewBox="-125 -100 260 310" preserveAspectRatio="xMidYMid meet"><use href="#tree"/></svg><svg x="400" y="-25" width="160" height="245" viewBox="-125 -100 260 310" preserveAspectRatio="xMidYMid meet"><use href="#tree"/></svg><svg x="-85" y="332" width="145" height="215" viewBox="-125 -100 260 310" preserveAspectRatio="xMidYMid meet"><use href="#tree"/></svg>
 <svg x="375" y="822" width="150" height="75" viewBox="-70 -60 145 110" preserveAspectRatio="xMidYMid meet"><use href="#bush"/></svg><svg x="438" y="647" width="85" height="60" viewBox="-70 -60 145 110" preserveAspectRatio="xMidYMid meet"><use href="#bush"/></svg>
 </svg>`;}
