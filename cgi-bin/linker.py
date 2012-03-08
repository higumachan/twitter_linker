#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import os
import cgi
import json
import urllib

link_users = [];

if (False):
    sys.exit();
else:
    try:
        form = cgi.FieldStorage();
        user = form["username"].value;
    except:
        user = "natrium11321";
    
    json_str = urllib.urlopen("http://search.twitter.com/search.json?rpp=30&q=from:%s" % (user,)).read();
    dic = json.loads(json_str);
    results = dic["results"];
    
    for result in results:
        text = result["text"];

        #print text;
        if (text.find(u"w/") != -1):    # フォースクエアを弾くためのコード
            continue;
        index = text.find("@");
        while (index != -1):
            link_user = "";
            user_name_len = 0;
            index += 1;
            while ((len(text) > index + user_name_len) and (text[index + user_name_len].isalnum() or text[index + user_name_len] == '_')):
                try:
                    link_user += text[index + user_name_len].decode("ascii");
                except:
                    break;
                user_name_len += 1;
            if ((not (link_user in link_users)) and link_user != "" and link_user != user):
                link_users.append(link_user);
            index = text.find("@", index + 1);
    
    res = {"users": link_users[:5]};

    print "Content-Type: text/html; charset=utf-8"
    print "";
    print json.dumps(res);

