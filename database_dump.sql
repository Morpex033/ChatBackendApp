PGDMP      .                 }            messager    17.2    17.2 "    [           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            \           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            ]           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            ^           1262    17527    messager    DATABASE     }   CREATE DATABASE messager WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Ukraine.1251';
    DROP DATABASE messager;
                     postgres    false                        3079    17528 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            _           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    2            �            1259    18046    account_chat    TABLE     b   CREATE TABLE public.account_chat (
    "chatsId" uuid NOT NULL,
    "accountsId" uuid NOT NULL
);
     DROP TABLE public.account_chat;
       public         heap r       postgres    false            �            1259    18020    accounts    TABLE     �  CREATE TABLE public.accounts (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nickname character varying NOT NULL,
    description character varying,
    username character varying NOT NULL,
    "dateOfBirth" date NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    role character varying NOT NULL,
    user_id uuid
);
    DROP TABLE public.accounts;
       public         heap r       postgres    false    2            �            1259    18009    chats    TABLE     i  CREATE TABLE public.chats (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying NOT NULL,
    description character varying,
    "isPublic" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "ownerId" uuid
);
    DROP TABLE public.chats;
       public         heap r       postgres    false    2            �            1259    18001 
   migrations    TABLE     �   CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);
    DROP TABLE public.migrations;
       public         heap r       postgres    false            �            1259    18000    migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.migrations_id_seq;
       public               postgres    false    219            `           0    0    migrations_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
          public               postgres    false    218            �            1259    18034    users    TABLE     -  CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false    2            �           2604    18004    migrations id    DEFAULT     n   ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
 <   ALTER TABLE public.migrations ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    218    219            X          0    18046    account_chat 
   TABLE DATA           ?   COPY public.account_chat ("chatsId", "accountsId") FROM stdin;
    public               postgres    false    223   :+       V          0    18020    accounts 
   TABLE DATA              COPY public.accounts (id, nickname, description, username, "dateOfBirth", "createdAt", "updatedAt", role, user_id) FROM stdin;
    public               postgres    false    221   �+       U          0    18009    chats 
   TABLE DATA           h   COPY public.chats (id, title, description, "isPublic", "createdAt", "updatedAt", "ownerId") FROM stdin;
    public               postgres    false    220   ,       T          0    18001 
   migrations 
   TABLE DATA           ;   COPY public.migrations (id, "timestamp", name) FROM stdin;
    public               postgres    false    219   �,       W          0    18034    users 
   TABLE DATA           N   COPY public.users (id, email, password, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    222   �,       a           0    0    migrations_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.migrations_id_seq', 1, true);
          public               postgres    false    218            �           2606    18019 $   chats PK_0117647b3c4a4e5ff198aeb6206 
   CONSTRAINT     d   ALTER TABLE ONLY public.chats
    ADD CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.chats DROP CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206";
       public                 postgres    false    220            �           2606    18029 '   accounts PK_5a7a02c20412299d198e097a8fe 
   CONSTRAINT     g   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.accounts DROP CONSTRAINT "PK_5a7a02c20412299d198e097a8fe";
       public                 postgres    false    221            �           2606    18008 )   migrations PK_8c82d7f526340ab734260ea46be 
   CONSTRAINT     i   ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.migrations DROP CONSTRAINT "PK_8c82d7f526340ab734260ea46be";
       public                 postgres    false    219            �           2606    18043 $   users PK_a3ffb1c0c8416b9fc6f907b7433 
   CONSTRAINT     d   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433";
       public                 postgres    false    222            �           2606    18050 +   account_chat PK_e0410811a06d53d899b8446dcf4 
   CONSTRAINT     �   ALTER TABLE ONLY public.account_chat
    ADD CONSTRAINT "PK_e0410811a06d53d899b8446dcf4" PRIMARY KEY ("chatsId", "accountsId");
 W   ALTER TABLE ONLY public.account_chat DROP CONSTRAINT "PK_e0410811a06d53d899b8446dcf4";
       public                 postgres    false    223    223            �           2606    18033 '   accounts REL_3000dad1da61b29953f0747632 
   CONSTRAINT     g   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "REL_3000dad1da61b29953f0747632" UNIQUE (user_id);
 S   ALTER TABLE ONLY public.accounts DROP CONSTRAINT "REL_3000dad1da61b29953f0747632";
       public                 postgres    false    221            �           2606    18031 '   accounts UQ_477e3187cedfb5a3ac121e899c9 
   CONSTRAINT     h   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9" UNIQUE (username);
 S   ALTER TABLE ONLY public.accounts DROP CONSTRAINT "UQ_477e3187cedfb5a3ac121e899c9";
       public                 postgres    false    221            �           2606    18045 $   users UQ_97672ac88f789774dd47f7c8be3 
   CONSTRAINT     b   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3";
       public                 postgres    false    222            �           1259    18052    IDX_51abe1fce2df29407904bc29a8    INDEX     a   CREATE INDEX "IDX_51abe1fce2df29407904bc29a8" ON public.account_chat USING btree ("accountsId");
 4   DROP INDEX public."IDX_51abe1fce2df29407904bc29a8";
       public                 postgres    false    223            �           1259    18051    IDX_9cb7bf5fa706057176bc41ea8e    INDEX     ^   CREATE INDEX "IDX_9cb7bf5fa706057176bc41ea8e" ON public.account_chat USING btree ("chatsId");
 4   DROP INDEX public."IDX_9cb7bf5fa706057176bc41ea8e";
       public                 postgres    false    223            �           2606    18058 '   accounts FK_3000dad1da61b29953f07476324    FK CONSTRAINT     �   ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT "FK_3000dad1da61b29953f07476324" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 S   ALTER TABLE ONLY public.accounts DROP CONSTRAINT "FK_3000dad1da61b29953f07476324";
       public               postgres    false    222    4791    221            �           2606    18053 $   chats FK_40d195fcbaada4020f429df8b48    FK CONSTRAINT     �   ALTER TABLE ONLY public.chats
    ADD CONSTRAINT "FK_40d195fcbaada4020f429df8b48" FOREIGN KEY ("ownerId") REFERENCES public.accounts(id) ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.chats DROP CONSTRAINT "FK_40d195fcbaada4020f429df8b48";
       public               postgres    false    221    220    4785            �           2606    18068 +   account_chat FK_51abe1fce2df29407904bc29a85    FK CONSTRAINT     �   ALTER TABLE ONLY public.account_chat
    ADD CONSTRAINT "FK_51abe1fce2df29407904bc29a85" FOREIGN KEY ("accountsId") REFERENCES public.accounts(id);
 W   ALTER TABLE ONLY public.account_chat DROP CONSTRAINT "FK_51abe1fce2df29407904bc29a85";
       public               postgres    false    223    4785    221            �           2606    18063 +   account_chat FK_9cb7bf5fa706057176bc41ea8e3    FK CONSTRAINT     �   ALTER TABLE ONLY public.account_chat
    ADD CONSTRAINT "FK_9cb7bf5fa706057176bc41ea8e3" FOREIGN KEY ("chatsId") REFERENCES public.chats(id) ON UPDATE CASCADE ON DELETE CASCADE;
 W   ALTER TABLE ONLY public.account_chat DROP CONSTRAINT "FK_9cb7bf5fa706057176bc41ea8e3";
       public               postgres    false    220    223    4783            X   J   x���� �s��eP��K.��	�{�(�`�hk4�y M8=��g�'�Ț�V��z��c��sL�^"�B��      V   o   x�}�11k�
>�Ӯ�$�:�A_��_r44���q�;�(⚔Q�~�z���Oc>��Uh�P��L_+�X4z����F�IX�8��[���̞i[�-��7i�'      U   h   x�}ɻ�0 �ښ"��GEϒ�������pxX��A�yB���G�\�ԯ��������
�@�"=�ĝͬ�?��SdB�$�z�
~ ������K�"P      T   /   x�3�447�463231225����,�L�qI,ILJ,NE������ ?�!      W   �   x�]ɻ�0 Й~�k뽗R�L���3�h\(l�aL��׻{�CȐ3�[��Q��� mdmPxyٺn^��kTѷ�O��O�;��%�q�<G���E�u�t����,q��U��*]���[7g�P(�$�u���j�W�� fqSB��,3     