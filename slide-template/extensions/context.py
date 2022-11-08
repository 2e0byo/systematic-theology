from datetime import datetime, time

from copier_templates_extensions import ContextHook
from dateutil.parser import parse
from requests import get


def get_multiplex_token():
    url = "https://reveal-multiplex.glitch.me/token"
    r = get(url)
    r.raise_for_status()
    data = r.json()
    return data["secret"], data["socketId"]


class ContextUpdater(ContextHook):
    def hook(self, context):
        secret, id = get_multiplex_token()
        context["multiplex_secret"] = secret
        context["multiplex_id"] = id
        context["runtime"] = parse(context["runtime"]) - datetime.combine(
            datetime.now().date(), time()
        )
        return context
