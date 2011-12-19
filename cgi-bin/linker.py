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
    form = cgi.FieldStorage();
    user = u"pinkroot";
    json_str = urllib.urlopen("http://search.twitter.com/search.json?q=from:%s" % (user,)).read();
    dic = json.loads(json_str);
    results = dic["results"];

    for result in results:
        text = result["text"];

        print text;

        if (text.find(u"w/") != -1):
            continue;
        index = text.find("@");
        while (index != -1):
            link_user = "";
            user_name_len = 0;
            while (text[index + user_name_len] != u' '):
                link_user += text[index + user_name_len];
                user_name_len += 1;
            link_users.append(link_user);
            index = text.find("@", index + 1);

    print json.dumps(link_users);

