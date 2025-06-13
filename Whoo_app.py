import streamlit as st
import whoo

st.title("whoo ログイン")

# セッション管理
if "client" not in st.session_state:
    st.session_state.client = None

# ログインフォーム
with st.form("login_form"):
    email = st.text_input("メールアドレス")
    password = st.text_input("パスワード", type="password")
    submitted = st.form_submit_button("ログイン")

if submitted:
    try:
        st.session_state.client = whoo.Client(email=email, password=password)
        st.success("ログイン成功")
    except Exception as e:
        st.error(f"エラー: {e}")

client = st.session_state.client

if client:
    st.header("操作メニュー")
    # アカウント情報
    if st.button("アカウント情報取得"):
        try:
            info = client.info()
            st.json(info)
        except Exception as e:
            st.error(str(e))


    # 友達リスト
    if st.button("友達リスト取得"):
        try:
            friends = client.get_friends()
            st.json(friends)
        except Exception as e:
            st.error(str(e))

    # 友達の位置情報
    if st.button("友達の位置情報取得"):
        try:
            locations = client.get_locations()
            st.json(locations)
        except Exception as e:
            st.error(str(e))

    # 位置情報更新
    with st.expander("位置情報を更新"):
        with st.form("update_location_form"):
            latitude = st.number_input("緯度", value=0.0, format="%.30f")
            longitude = st.number_input("経度", value=0.0, format="%.30f")
            level = st.number_input("バッテリー(%)", value=100, min_value=0, max_value=100)
            state = st.selectbox("充電ステータス", [0, 1], format_func=lambda x: "通常" if x == 0 else "充電")
            speed = st.number_input("移動速度(km/h)", value=0.0)
            stayed_at = st.text_input("滞在開始(例:2025-04-1 00:00:00 +0900)",value="2025-04-1 00:00:00 +0900")
            update_submitted = st.form_submit_button("更新実行")
        if update_submitted:
            try:
                client.update_location(
                    location={"latitude": latitude, "longitude": longitude},
                    level=level,
                    state=state,
                    speed=speed,
                    stayed_at=stayed_at if stayed_at else None,
                )
                st.success("位置情報を更新しました")
            except Exception as e:
                st.error(str(e))

    # オンライン・オフライン切替
    col1, col2 = st.columns(2)
    with col1:
        if st.button("オンラインにする"):
            try:
                client.online()
                st.success("オンラインにしました")
            except Exception as e:
                st.error(str(e))
    with col2:
        if st.button("オフラインにする"):
            try:
                client.offline()
                st.success("オフラインにしました")
            except Exception as e:
                st.error(str(e))